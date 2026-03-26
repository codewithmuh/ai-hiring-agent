import logging

from django.db.models import Avg, Count, Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Candidate, InterviewSlot, Job
from .serializers import (
    CandidateListSerializer,
    CandidateDetailSerializer,
    ResumeUploadSerializer,
    ApplicationSerializer,
    InterviewSlotSerializer,
    JobListSerializer,
    JobDetailSerializer,
)
from .services import claude_service, vapi_service

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────
# GET /api/jobs/
# ──────────────────────────────────────────
@api_view(['GET'])
def job_list(request):
    """List all open jobs."""
    qs = Job.objects.annotate(candidate_count=Count('candidates'))
    status_filter = request.query_params.get('status', 'open')
    if status_filter:
        qs = qs.filter(status=status_filter)
    serializer = JobListSerializer(qs, many=True)
    return Response(serializer.data)


# ──────────────────────────────────────────
# GET /api/jobs/{id}/
# ──────────────────────────────────────────
@api_view(['GET'])
def job_detail(request, pk):
    """Job detail with full description."""
    try:
        job = Job.objects.annotate(candidate_count=Count('candidates')).get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = JobDetailSerializer(job)
    return Response(serializer.data)


# ──────────────────────────────────────────
# POST /api/candidates/upload/
# ──────────────────────────────────────────
@api_view(['POST'])
def upload_resume(request):
    """Upload a resume PDF, screen it with Claude AI, and create a candidate."""
    serializer = ResumeUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    pdf_file = serializer.validated_data['resume_file']
    job_description = serializer.validated_data['job_description']
    pdf_bytes = pdf_file.read()

    # Resolve job if provided
    job = None
    job_id = serializer.validated_data.get('job_id')
    if job_id:
        try:
            job = Job.objects.get(pk=job_id)
            job_description = job.description
        except Job.DoesNotExist:
            pass

    # Screen with Claude
    try:
        result = claude_service.screen_resume(pdf_bytes, job_description)
    except Exception as e:
        logger.error("Claude screening failed: %s", e)
        return Response({"error": "Resume screening failed"}, status=status.HTTP_502_BAD_GATEWAY)

    score = result.get('score', 0)
    recommendation = result.get('recommendation', 'reject')

    pdf_file.seek(0)
    candidate = Candidate.objects.create(
        name=serializer.validated_data.get('name') or result.get('name', 'Unknown'),
        email=serializer.validated_data.get('email') or result.get('email'),
        phone=serializer.validated_data.get('phone') or result.get('phone'),
        resume_file=pdf_file,
        job=job,
        job_description=job_description,
        resume_score=score,
        resume_strengths=result.get('strengths', []),
        resume_red_flags=result.get('red_flags', []),
        resume_recommendation=recommendation,
        resume_analysis=result,
        overall_score=score,
        final_status=Candidate.FinalStatus.SCREENING,
    )

    return Response(CandidateDetailSerializer(candidate).data, status=status.HTTP_201_CREATED)


# ──────────────────────────────────────────
# POST /api/candidates/{id}/interview/
# ──────────────────────────────────────────
@api_view(['POST'])
def trigger_interview(request, pk):
    """Trigger an AI voice interview call for a candidate."""
    try:
        candidate = Candidate.objects.get(pk=pk)
    except Candidate.DoesNotExist:
        return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)

    if candidate.resume_score is None or candidate.resume_score < 60:
        return Response({"error": "Candidate score too low for interview"}, status=status.HTTP_400_BAD_REQUEST)

    if not candidate.phone:
        return Response({"error": "Candidate has no phone number"}, status=status.HTTP_400_BAD_REQUEST)

    if candidate.interview_status not in (Candidate.InterviewStatus.PENDING, Candidate.InterviewStatus.SCHEDULED):
        return Response({"error": "Interview already in progress or completed"}, status=status.HTTP_400_BAD_REQUEST)

    key_skill = candidate.resume_strengths[0] if candidate.resume_strengths else "your primary technical skill"

    try:
        call_data = vapi_service.create_call(
            candidate_name=candidate.name,
            phone_number=candidate.phone,
            key_skill=key_skill,
        )
    except Exception as e:
        logger.error("Vapi call failed for candidate %s: %s", candidate.id, e)
        candidate.interview_status = Candidate.InterviewStatus.FAILED
        candidate.save(update_fields=['interview_status'])
        return Response({"error": f"Failed to initiate call: {e}"}, status=status.HTTP_502_BAD_GATEWAY)

    candidate.vapi_call_id = call_data.get('id')
    candidate.interview_status = Candidate.InterviewStatus.IN_PROGRESS
    candidate.final_status = Candidate.FinalStatus.INTERVIEWING
    candidate.save(update_fields=['vapi_call_id', 'interview_status', 'final_status'])

    return Response({
        "call_id": candidate.vapi_call_id,
        "status": "initiated",
    })


# ──────────────────────────────────────────
# POST /api/webhooks/vapi/
# ──────────────────────────────────────────
@api_view(['POST'])
def vapi_webhook(request):
    """Handle Vapi webhook — receives interview transcript after call ends."""
    data = request.data
    message_type = data.get('message', {}).get('type', '') if isinstance(data.get('message'), dict) else data.get('type', '')

    if message_type != 'end-of-call-report':
        return Response({"status": "ignored"})

    message = data.get('message', data)
    call_id = message.get('call', {}).get('id') or message.get('callId', '')
    transcript = message.get('transcript', '') or message.get('artifact', {}).get('transcript', '')

    if not call_id:
        return Response({"error": "No call ID"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        candidate = Candidate.objects.get(vapi_call_id=call_id)
    except Candidate.DoesNotExist:
        logger.warning("Webhook received for unknown call_id: %s", call_id)
        return Response({"error": "Candidate not found for this call"}, status=status.HTTP_404_NOT_FOUND)

    candidate.interview_transcript = transcript
    candidate.interview_status = Candidate.InterviewStatus.COMPLETED

    if transcript:
        try:
            analysis = claude_service.analyze_transcript(transcript, candidate.job_description or "")
            candidate.interview_score = analysis.get('score', 0)
            candidate.interview_analysis = analysis

            if candidate.resume_score is not None:
                candidate.overall_score = int(candidate.resume_score * 0.6 + candidate.interview_score * 0.4)

            if candidate.overall_score and candidate.overall_score >= 75:
                candidate.final_status = Candidate.FinalStatus.SHORTLISTED
            elif candidate.overall_score and candidate.overall_score < 50:
                candidate.final_status = Candidate.FinalStatus.REJECTED
            else:
                candidate.final_status = Candidate.FinalStatus.INTERVIEWING
        except Exception as e:
            logger.error("Transcript analysis failed for candidate %s: %s", candidate.id, e)

    candidate.save()
    return Response({"status": "processed"})


# ──────────────────────────────────────────
# GET /api/candidates/
# ──────────────────────────────────────────
@api_view(['GET'])
def candidate_list(request):
    """List all candidates with optional filters."""
    qs = Candidate.objects.select_related('job').all()

    final_status = request.query_params.get('status')
    if final_status:
        qs = qs.filter(final_status=final_status)

    job_id = request.query_params.get('job')
    if job_id:
        qs = qs.filter(job_id=job_id)

    min_score = request.query_params.get('min_score')
    max_score = request.query_params.get('max_score')
    if min_score:
        qs = qs.filter(overall_score__gte=int(min_score))
    if max_score:
        qs = qs.filter(overall_score__lte=int(max_score))

    serializer = CandidateListSerializer(qs, many=True)
    return Response(serializer.data)


# ──────────────────────────────────────────
# GET /api/candidates/{id}/
# ──────────────────────────────────────────
@api_view(['GET'])
def candidate_detail(request, pk):
    """Full candidate detail."""
    try:
        candidate = Candidate.objects.select_related('job').get(pk=pk)
    except Candidate.DoesNotExist:
        return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CandidateDetailSerializer(candidate)
    return Response(serializer.data)


# ──────────────────────────────────────────
# GET /api/dashboard/stats/
# ──────────────────────────────────────────
@api_view(['GET'])
def dashboard_stats(request):
    """Summary stats for the dashboard."""
    qs = Candidate.objects.all()
    return Response({
        "total_candidates": qs.count(),
        "avg_score": qs.filter(overall_score__isnull=False).aggregate(avg=Avg('overall_score'))['avg'] or 0,
        "interviewed_count": qs.filter(interview_status=Candidate.InterviewStatus.COMPLETED).count(),
        "shortlisted_count": qs.filter(final_status=Candidate.FinalStatus.SHORTLISTED).count(),
    })


# ──────────────────────────────────────────
# GET /api/slots/available/
# ──────────────────────────────────────────
@api_view(['GET'])
def available_slots(request):
    """Return available (unbooked) interview slots."""
    qs = InterviewSlot.objects.filter(is_booked=False)

    date = request.query_params.get('date')
    if date:
        qs = qs.filter(start_time__date=date)

    serializer = InterviewSlotSerializer(qs, many=True)
    return Response(serializer.data)


# ──────────────────────────────────────────
# POST /api/apply/
# ──────────────────────────────────────────
@api_view(['POST'])
def apply(request):
    """Public application endpoint: upload resume, screen, and optionally book a slot."""
    serializer = ApplicationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    pdf_file = serializer.validated_data['resume_file']
    job_id = serializer.validated_data['job_id']

    try:
        job = Job.objects.get(pk=job_id, status=Job.Status.OPEN)
    except Job.DoesNotExist:
        return Response({"error": "Job not found or closed"}, status=status.HTTP_404_NOT_FOUND)

    pdf_bytes = pdf_file.read()

    # Screen with Claude
    try:
        result = claude_service.screen_resume(pdf_bytes, job.description)
    except Exception as e:
        logger.error("Claude screening failed: %s", e)
        return Response({"error": "Resume screening failed"}, status=status.HTTP_502_BAD_GATEWAY)

    score = result.get('score', 0)
    recommendation = result.get('recommendation', 'reject')

    pdf_file.seek(0)
    candidate = Candidate.objects.create(
        name=serializer.validated_data['name'],
        email=serializer.validated_data['email'],
        phone=serializer.validated_data['phone'],
        resume_file=pdf_file,
        job=job,
        job_description=job.description,
        resume_score=score,
        resume_strengths=result.get('strengths', []),
        resume_red_flags=result.get('red_flags', []),
        resume_recommendation=recommendation,
        resume_analysis=result,
        overall_score=score,
        final_status=Candidate.FinalStatus.SCREENING,
    )

    # Book slot if score qualifies
    interview_scheduled = False
    scheduled_time = None
    slot_id = serializer.validated_data.get('selected_slot_id')

    if score >= 60 and slot_id:
        try:
            slot = InterviewSlot.objects.get(pk=slot_id, is_booked=False)
            slot.is_booked = True
            slot.candidate = candidate
            slot.save()

            candidate.scheduled_interview_time = slot.start_time
            candidate.interview_status = Candidate.InterviewStatus.SCHEDULED
            candidate.final_status = Candidate.FinalStatus.INTERVIEWING
            candidate.save(update_fields=['scheduled_interview_time', 'interview_status', 'final_status'])

            interview_scheduled = True
            scheduled_time = slot.start_time.isoformat()
        except InterviewSlot.DoesNotExist:
            logger.warning("Selected slot %s not available", slot_id)

    return Response({
        "candidate_id": str(candidate.id),
        "name": candidate.name,
        "resume_score": score,
        "resume_recommendation": recommendation,
        "interview_scheduled": interview_scheduled,
        "scheduled_time": scheduled_time,
    }, status=status.HTTP_201_CREATED)

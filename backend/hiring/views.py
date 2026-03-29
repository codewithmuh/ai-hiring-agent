import json
import logging
import time
import uuid as uuid_lib

from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
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
from .services.interviewer import handle_conversation_turn, openai_messages_to_claude

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

    if candidate.interview_status not in (Candidate.InterviewStatus.PENDING, Candidate.InterviewStatus.SCHEDULED, Candidate.InterviewStatus.FAILED):
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
    """Handle Vapi webhook — receives live transcript updates and end-of-call reports."""
    data = request.data
    message = data.get('message', data)
    message_type = message.get('type', '') if isinstance(message, dict) else ''

    logger.info("Vapi webhook: type=%s", message_type)

    # ── Live transcript updates during the call ──
    if message_type == 'transcript':
        call_id = message.get('call', {}).get('id') or data.get('call', {}).get('id', '')
        role = message.get('role', '')
        text = message.get('transcript', '')
        is_final = message.get('transcriptType', '') == 'final'

        if call_id and text and is_final:
            try:
                candidate = Candidate.objects.get(vapi_call_id=call_id)
                speaker = "AI" if role == "bot" else candidate.name
                line = f"{speaker}: {text}"
                # Append to existing transcript
                if candidate.interview_transcript:
                    candidate.interview_transcript += f"\n\n{line}"
                else:
                    candidate.interview_transcript = line
                candidate.save(update_fields=['interview_transcript'])
                logger.info("Live transcript updated for %s: %s", candidate.name, text[:50])
            except Candidate.DoesNotExist:
                pass
        return Response({"status": "ok"})

    # ── Conversation update (full transcript so far) ──
    if message_type == 'conversation-update':
        call_id = message.get('call', {}).get('id') or data.get('call', {}).get('id', '')
        conversation = message.get('conversation', [])

        if call_id and conversation:
            try:
                candidate = Candidate.objects.get(vapi_call_id=call_id)
                lines = []
                for msg in conversation:
                    role = msg.get('role', '')
                    content = msg.get('content', '')
                    if content:
                        speaker = "AI" if role == "bot" or role == "assistant" else candidate.name
                        lines.append(f"{speaker}: {content}")
                if lines:
                    candidate.interview_transcript = "\n\n".join(lines)
                    candidate.save(update_fields=['interview_transcript'])
                    logger.info("Conversation updated for %s (%d messages)", candidate.name, len(lines))
            except Candidate.DoesNotExist:
                pass
        return Response({"status": "ok"})

    # ── End of call report — final transcript + analysis ──
    if message_type == 'end-of-call-report':
        call_id = message.get('call', {}).get('id') or message.get('callId', '')
        transcript = message.get('transcript', '') or message.get('artifact', {}).get('transcript', '')

        if not call_id:
            return Response({"error": "No call ID"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            candidate = Candidate.objects.get(vapi_call_id=call_id)
        except Candidate.DoesNotExist:
            logger.warning("Webhook received for unknown call_id: %s", call_id)
            return Response({"error": "Candidate not found for this call"}, status=status.HTTP_404_NOT_FOUND)

        # Use final transcript if available, keep live one if not
        if transcript:
            candidate.interview_transcript = transcript
        candidate.interview_status = Candidate.InterviewStatus.COMPLETED

        if candidate.interview_transcript:
            try:
                analysis = claude_service.analyze_transcript(candidate.interview_transcript, candidate.job_description or "")
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
        logger.info("Call ended for %s, status=%s", candidate.name, candidate.final_status)
        return Response({"status": "processed"})

    return Response({"status": "ignored"})


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


# ──────────────────────────────────────────
# POST /api/vapi/chat/completions/
# Custom LLM endpoint — Vapi sends OpenAI-format
# messages here, we call Claude directly.
# ──────────────────────────────────────────
@csrf_exempt
def vapi_chat_completions(request):
    """OpenAI-compatible chat completions endpoint for Vapi custom LLM."""
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    messages = data.get("messages", [])
    if not messages:
        return JsonResponse({"error": "No messages provided"}, status=400)

    # Extract candidate info from call metadata
    call_data = data.get("call", {})
    metadata = call_data.get("metadata", {}) or data.get("metadata", {})
    candidate_name = metadata.get("candidate_name", "Candidate")
    key_skill = metadata.get("key_skill", "your primary technical skill")

    logger.info("Custom LLM: %d messages, candidate=%s", len(messages), candidate_name)

    # Convert Vapi (OpenAI format) -> Claude format
    claude_messages = openai_messages_to_claude(messages)
    if not claude_messages:
        return JsonResponse({"error": "No valid messages"}, status=400)

    # Ensure starts with user message
    if claude_messages[0]["role"] != "user":
        claude_messages.insert(0, {"role": "user", "content": "Hello"})

    # Merge consecutive same-role messages (Claude requires alternating)
    fixed = []
    for msg in claude_messages:
        if fixed and fixed[-1]["role"] == msg["role"]:
            fixed[-1]["content"] += "\n" + msg["content"]
        else:
            fixed.append(msg)

    try:
        result = handle_conversation_turn(fixed, candidate_name=candidate_name, key_skill=key_skill)
        response_text = result["text"]
        end_call = result["end_call"]
    except Exception as e:
        logger.error("Custom LLM error: %s", e)
        response_text = "I'm sorry, I'm having a technical issue. Let me wrap up — we'll review your application and get back to you."
        end_call = True

    # Check if streaming
    if data.get("stream", False):
        return _stream_response(response_text, end_call)

    # Return OpenAI chat completions format
    resp = JsonResponse({
        "id": f"chatcmpl-{uuid_lib.uuid4().hex[:12]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": "claude-sonnet-4-20250514",
        "choices": [{
            "index": 0,
            "message": {"role": "assistant", "content": response_text},
            "finish_reason": "stop",
        }],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    })
    if end_call:
        resp["X-Vapi-End-Call"] = "true"
    return resp


def _stream_response(text: str, end_call: bool = False):
    """Return a streaming response in OpenAI SSE format."""
    completion_id = f"chatcmpl-{uuid_lib.uuid4().hex[:12]}"

    def event_stream():
        chunk = {
            "id": completion_id,
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": "claude-sonnet-4-20250514",
            "choices": [{"index": 0, "delta": {"role": "assistant", "content": text}, "finish_reason": None}],
        }
        yield f"data: {json.dumps(chunk)}\n\n"

        stop_chunk = {
            "id": completion_id,
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": "claude-sonnet-4-20250514",
            "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
        }
        yield f"data: {json.dumps(stop_chunk)}\n\n"
        yield "data: [DONE]\n\n"

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    if end_call:
        response["X-Vapi-End-Call"] = "true"
    return response

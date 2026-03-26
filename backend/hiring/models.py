import uuid
from django.db import models


class Job(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open'
        CLOSED = 'closed'
        PAUSED = 'paused'

    class JobType(models.TextChoices):
        FULL_TIME = 'full_time', 'Full-time'
        PART_TIME = 'part_time', 'Part-time'
        CONTRACT = 'contract', 'Contract'
        INTERNSHIP = 'internship', 'Internship'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True, default="")
    location = models.CharField(max_length=200, blank=True, default="")
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    responsibilities = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    nice_to_have = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class Candidate(models.Model):
    class ResumeRecommendation(models.TextChoices):
        INTERVIEW = 'interview'
        REJECT = 'reject'
        MAYBE = 'maybe'

    class InterviewStatus(models.TextChoices):
        PENDING = 'pending'
        SCHEDULED = 'scheduled'
        IN_PROGRESS = 'in_progress'
        COMPLETED = 'completed'
        FAILED = 'failed'

    class FinalStatus(models.TextChoices):
        NEW = 'new'
        SCREENING = 'screening'
        INTERVIEWING = 'interviewing'
        SHORTLISTED = 'shortlisted'
        REJECTED = 'rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    job = models.ForeignKey(Job, null=True, blank=True, on_delete=models.SET_NULL, related_name='candidates')
    job_description = models.TextField(blank=True, null=True)

    # Resume screening
    resume_score = models.IntegerField(null=True, blank=True)
    resume_strengths = models.JSONField(default=list, blank=True)
    resume_red_flags = models.JSONField(default=list, blank=True)
    resume_recommendation = models.CharField(
        max_length=20, choices=ResumeRecommendation.choices, blank=True, null=True
    )
    resume_analysis = models.JSONField(null=True, blank=True)

    # Voice interview
    interview_status = models.CharField(
        max_length=20, choices=InterviewStatus.choices, default=InterviewStatus.PENDING
    )
    vapi_call_id = models.CharField(max_length=255, blank=True, null=True)
    interview_transcript = models.TextField(blank=True, null=True)
    interview_score = models.IntegerField(null=True, blank=True)
    interview_analysis = models.JSONField(null=True, blank=True)

    # Scheduling
    scheduled_interview_time = models.DateTimeField(null=True, blank=True)
    interview_reminder_sent = models.BooleanField(default=False)

    # Final
    overall_score = models.IntegerField(null=True, blank=True)
    final_status = models.CharField(
        max_length=20, choices=FinalStatus.choices, default=FinalStatus.NEW
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-overall_score', '-created_at']

    def __str__(self):
        return f"{self.name} (Score: {self.overall_score or 'N/A'})"


class InterviewSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)
    candidate = models.ForeignKey(
        Candidate, null=True, blank=True, on_delete=models.SET_NULL, related_name='booked_slot'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.start_time.strftime('%Y-%m-%d %H:%M')} ({'Booked' if self.is_booked else 'Available'})"

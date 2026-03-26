from django.contrib import admin
from .models import Candidate, InterviewSlot, Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'location', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type', 'department']
    search_fields = ['title', 'department']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'job', 'resume_score', 'interview_score', 'overall_score', 'final_status', 'created_at']
    list_filter = ['final_status', 'interview_status', 'resume_recommendation', 'job']
    search_fields = ['name', 'email']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(InterviewSlot)
class InterviewSlotAdmin(admin.ModelAdmin):
    list_display = ['start_time', 'end_time', 'is_booked', 'candidate']
    list_filter = ['is_booked']

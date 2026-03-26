from rest_framework import serializers
from .models import Candidate, InterviewSlot, Job


class JobListSerializer(serializers.ModelSerializer):
    candidate_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'department', 'location', 'job_type',
            'salary_min', 'salary_max', 'status', 'candidate_count',
            'created_at',
        ]


class JobDetailSerializer(serializers.ModelSerializer):
    candidate_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Job
        fields = '__all__'


class CandidateListSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True, default=None)

    class Meta:
        model = Candidate
        fields = [
            'id', 'name', 'email', 'phone',
            'resume_score', 'resume_recommendation', 'resume_strengths',
            'interview_status', 'interview_score',
            'overall_score', 'final_status',
            'job', 'job_title',
            'created_at', 'updated_at',
        ]


class CandidateDetailSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True, default=None)

    class Meta:
        model = Candidate
        fields = '__all__'


class ResumeUploadSerializer(serializers.Serializer):
    resume_file = serializers.FileField()
    job_description = serializers.CharField()
    job_id = serializers.UUIDField(required=False)
    name = serializers.CharField(required=False, default="")
    email = serializers.EmailField(required=False, default="")
    phone = serializers.CharField(required=False, default="")


class ApplicationSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    resume_file = serializers.FileField()
    job_id = serializers.UUIDField()
    selected_slot_id = serializers.UUIDField(required=False)


class InterviewSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSlot
        fields = ['id', 'start_time', 'end_time', 'is_booked']

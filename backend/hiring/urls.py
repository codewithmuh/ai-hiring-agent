from django.urls import path
from . import views

urlpatterns = [
    # Jobs
    path('api/jobs/', views.job_list, name='job_list'),
    path('api/jobs/<uuid:pk>/', views.job_detail, name='job_detail'),

    # Resume upload & screening
    path('api/candidates/upload/', views.upload_resume, name='upload_resume'),

    # Candidate list & detail
    path('api/candidates/', views.candidate_list, name='candidate_list'),
    path('api/candidates/<uuid:pk>/', views.candidate_detail, name='candidate_detail'),

    # Interview trigger
    path('api/candidates/<uuid:pk>/interview/', views.trigger_interview, name='trigger_interview'),

    # Vapi webhook
    path('api/webhooks/vapi/', views.vapi_webhook, name='vapi_webhook'),

    # Dashboard stats
    path('api/dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),

    # Interview slots
    path('api/slots/available/', views.available_slots, name='available_slots'),

    # Public application
    path('api/apply/', views.apply, name='apply'),
]

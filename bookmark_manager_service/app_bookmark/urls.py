from django.urls import path
from . import views

urlpatterns = [
    path('bookmarks/', views.BookmarkListCreateView.as_view(), name='bookmark-list-create'),
    path('bookmarks/<uuid:pk>/', views.BookmarkDetailView.as_view(), name='bookmark-detail'),
    path('bookmarks/<uuid:bookmark_id>/refresh/', views.refresh_bookmark, name='bookmark-refresh'),
    path('supported-sites/', views.supported_sites, name='supported-sites'),
    path('tasks/<str:task_id>/status/', views.task_status, name='task-status'),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user, SongViewSet, GenerateSongView, MySongsView, AllSongsView, GeneratedSongDetailView, PlaylistViewSet

router = DefaultRouter()
router.register(r'songs', SongViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('generate/', GenerateSongView.as_view(), name='generate'),
    path('generated-songs/<int:pk>/', GeneratedSongDetailView.as_view({'delete': 'destroy'}), name='generated-song-detail'),
    path('generated-songs/<int:pk>/like/', GeneratedSongDetailView.as_view({'post': 'like'}), name='generated-song-like'),
    path('my-songs/', MySongsView.as_view(), name='my-songs'),
    path('all-songs/', AllSongsView.as_view(), name='all-songs'),
    path('', include(router.urls)),
]

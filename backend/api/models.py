from django.db import models
from django.contrib.auth.models import User

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='songs/')
    cover_image = models.ImageField(upload_to='covers/', null=True, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_songs')
    likes = models.ManyToManyField(User, related_name='liked_songs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class GeneratedSong(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_songs')
    title = models.CharField(max_length=255, default="Untitled")
    prompt = models.TextField()
    audio_file = models.FileField(upload_to='generated/')
    cover_image = models.ImageField(upload_to='generated_covers/', null=True, blank=True)
    likes = models.ManyToManyField(User, related_name='liked_generated_songs', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Generated: {self.prompt[:20]}..."

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    songs = models.ManyToManyField(Song, related_name='playlists', blank=True)
    generated_songs = models.ManyToManyField(GeneratedSong, related_name='playlists', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

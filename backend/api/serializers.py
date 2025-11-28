from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Song, GeneratedSong, Playlist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SongSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'audio_file', 'cover_image', 'uploaded_by', 'created_at', 'is_liked']

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

class GeneratedSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedSong
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'

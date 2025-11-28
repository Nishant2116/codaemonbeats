from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Song, GeneratedSong, Playlist
from .serializers import UserSerializer, SongSerializer, GeneratedSongSerializer, PlaylistSerializer
import random

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print(f"Register Request Data: {request.data}")
    print(f"Register Request Headers: {request.headers}")
    
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user_id': user.pk,
        'username': user.username
    }, status=status.HTTP_201_CREATED)

from rest_framework.decorators import action
import requests
from django.core.files.base import ContentFile

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by('-created_at')
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        song = self.get_object()
        user = request.user
        if song.likes.filter(id=user.id).exists():
            song.likes.remove(user)
            liked = False
        else:
            song.likes.add(user)
            liked = True
        return Response({'liked': liked, 'likes_count': song.likes.count()})

class GenerateSongView(generics.CreateAPIView):
    serializer_class = GeneratedSongSerializer
    permission_classes = [IsAuthenticated]

import os
import io
import subprocess
import tempfile
import requests

class GenerateSongView(generics.CreateAPIView):
    serializer_class = GeneratedSongSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        prompt = request.data.get('prompt')
        title = request.data.get('title', 'Untitled Creation')
        genre = request.data.get('genre', 'pop').lower()
        voice_gender = request.data.get('voice', 'female').lower()
        
        # Select Voice
        # Male: en-US-ChristopherNeural, Female: en-US-AriaNeural
        voice_name = 'en-US-ChristopherNeural' if voice_gender == 'male' else 'en-US-AriaNeural'

        # 1. Generate Speech using edge-tts
        speech_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
                speech_path = f.name
            
            # Run edge-tts CLI
            command = ['edge-tts', '--text', prompt, '--write-media', speech_path, '--voice', voice_name]
            subprocess.run(command, check=True)
            
        except Exception as e:
            print(f"TTS Failed: {e}")
            if speech_path and os.path.exists(speech_path):
                os.unlink(speech_path)
            speech_path = None

        # 2. Load Beat
        beat_path = os.path.join('media', 'beats', f'{genre}.mp3')
        if not os.path.exists(beat_path):
            beat_path = os.path.join('media', 'beats', 'pop.mp3') # Fallback
        
        # 3. Mix using ffmpeg (subprocess)
        audio_content = None
        if speech_path and os.path.exists(beat_path):
            try:
                # Mix beat (vol 0.6) and speech (vol 1.5), cut to shortest duration
                command = [
                    'ffmpeg', '-y',
                    '-i', beat_path,
                    '-i', speech_path,
                    '-filter_complex', '[0:a]volume=0.6[a];[1:a]volume=1.5[b];[a][b]amix=inputs=2:duration=shortest',
                    '-f', 'mp3',
                    'pipe:1'
                ]
                result = subprocess.run(command, capture_output=True, check=True)
                audio_content = result.stdout
            except Exception as e:
                print(f"FFmpeg Mixing Failed: {e}")
        
        # Cleanup speech file
        if speech_path and os.path.exists(speech_path):
            os.unlink(speech_path)

        # Fallback if mixing failed
        if not audio_content:
            if os.path.exists(beat_path):
                with open(beat_path, 'rb') as f:
                    audio_content = f.read()
            else:
                audio_content = b'MOCK AUDIO CONTENT'

        # 5. Fetch Cover Image
        try:
            img_response = requests.get(f"https://picsum.photos/seed/{random.randint(0, 10000)}/500")
            if img_response.status_code == 200:
                cover_content = img_response.content
            else:
                cover_content = None
        except:
            cover_content = None

        file_name = f"generated_{random.randint(1000, 9999)}.mp3"
        cover_name = f"cover_{random.randint(1000, 9999)}.jpg"
        
        generated_song = GeneratedSong.objects.create(
            user=request.user,
            title=title,
            prompt=prompt,
        )
        generated_song.audio_file.save(file_name, ContentFile(audio_content), save=False)
        
        if cover_content:
            generated_song.cover_image.save(cover_name, ContentFile(cover_content), save=False)
            
        generated_song.save()
        
        serializer = self.get_serializer(generated_song)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework import mixins

class GeneratedSongDetailView(mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = GeneratedSong.objects.all()
    serializer_class = GeneratedSongSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        # Allow any user to delete
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        song = self.get_object()
        user = request.user
        if song.likes.filter(id=user.id).exists():
            song.likes.remove(user)
            liked = False
        else:
            song.likes.add(user)
            liked = True
        return Response({'liked': liked, 'likes_count': song.likes.count()})

class MySongsView(generics.ListAPIView):
    serializer_class = GeneratedSongSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GeneratedSong.objects.filter(user=self.request.user).order_by('-created_at')

from rest_framework.views import APIView

class AllSongsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        songs = Song.objects.all()
        generated_songs = GeneratedSong.objects.all()
        
        combined_list = []
        
        for song in songs:
            combined_list.append({
                'id': song.id,
                'title': song.title,
                'artist': song.artist,
                'audio_file': request.build_absolute_uri(song.audio_file.url) if song.audio_file else None,
                'cover_image': request.build_absolute_uri(song.cover_image.url) if song.cover_image else None,
                'is_generated': False,
                'created_at': song.created_at,
                'is_liked': song.likes.filter(id=request.user.id).exists(),
                'is_owner': True # Allow delete for everyone
            })
            
        for song in generated_songs:
            combined_list.append({
                'id': song.id, 
                'title': song.title,
                'artist': "AI Generator", 
                'audio_file': request.build_absolute_uri(song.audio_file.url) if song.audio_file else None,
                'cover_image': request.build_absolute_uri(song.cover_image.url) if song.cover_image else None,
                'is_generated': True,
                'created_at': song.created_at,
                'is_liked': song.likes.filter(id=request.user.id).exists(),
                'is_owner': True # Allow delete for everyone
            })
            
        # Sort by created_at desc
        combined_list.sort(key=lambda x: x['created_at'], reverse=True)
        
        return Response(combined_list)

class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

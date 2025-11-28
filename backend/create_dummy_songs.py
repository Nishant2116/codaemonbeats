import os
import django
import requests
from django.core.files.base import ContentFile
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codeamon_audio_app.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Song

def create_dummy_songs():
    user = User.objects.first()
    if not user:
        print("No user found. Create a user first.")
        return

    songs_data = [
        {
            "title": "Summer Breeze",
            "artist": "Chill Vibes",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "cover": "https://picsum.photos/seed/summer/300"
        },
        {
            "title": "Midnight Coding",
            "artist": "LoFi Beats",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            "cover": "https://picsum.photos/seed/midnight/300"
        },
        {
            "title": "Urban Flow",
            "artist": "City Sounds",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            "cover": "https://picsum.photos/seed/urban/300"
        }
    ]

    print("Creating dummy songs...")
    for data in songs_data:
        if Song.objects.filter(title=data['title']).exists():
            print(f"Skipping {data['title']} (already exists)")
            continue

        print(f"Downloading {data['title']}...")
        try:
            audio_content = requests.get(data['url']).content
            cover_content = requests.get(data['cover']).content
            
            song = Song(
                title=data['title'],
                artist=data['artist'],
                uploaded_by=user
            )
            song.audio_file.save(f"{data['title'].lower().replace(' ', '_')}.mp3", ContentFile(audio_content), save=False)
            song.cover_image.save(f"{data['title'].lower().replace(' ', '_')}.jpg", ContentFile(cover_content), save=False)
            song.save()
            print(f"Created {data['title']}")
        except Exception as e:
            print(f"Failed to create {data['title']}: {e}")

    print("Done!")

if __name__ == '__main__':
    create_dummy_songs()

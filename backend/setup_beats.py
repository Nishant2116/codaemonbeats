import os
import requests

BEATS_DIR = 'media/beats'
os.makedirs(BEATS_DIR, exist_ok=True)

beats = {
    'pop': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'lofi': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'hiphop': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
}

def download_beats():
    print("Downloading beats...")
    for genre, url in beats.items():
        path = os.path.join(BEATS_DIR, f'{genre}.mp3')
        if os.path.exists(path):
            print(f"Skipping {genre} (already exists)")
            continue
        
        print(f"Downloading {genre}...")
        try:
            response = requests.get(url)
            with open(path, 'wb') as f:
                f.write(response.content)
            print(f"Saved {genre}.mp3")
        except Exception as e:
            print(f"Failed to download {genre}: {e}")

if __name__ == '__main__':
    download_beats()

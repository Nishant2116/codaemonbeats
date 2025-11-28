import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codeamon_audio_app.settings')
django.setup()

from django.contrib.auth.models import User

username = 'Nishant'
password = 'pass123'
email = 'nishant@example.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_user(username=username, password=password, email=email)
    print(f"User '{username}' created successfully.")
else:
    print(f"User '{username}' already exists.")

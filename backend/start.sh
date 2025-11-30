#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start gunicorn
gunicorn codeamon_audio_app.wsgi:application --bind 0.0.0.0:$PORT --log-file -

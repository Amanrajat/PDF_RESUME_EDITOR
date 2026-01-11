FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN python manage.py collectstatic --noinput || true

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

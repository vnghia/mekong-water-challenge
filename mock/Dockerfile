FROM python:3.11-alpine3.18

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY main.py ./
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--access-log", "--forwarded-allow-ips", "*", "--workers", "4"]

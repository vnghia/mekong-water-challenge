FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY main.py ./
COPY data/devices.json ./data/
COPY data/analyses.json ./data/
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--access-log", "--forwarded-allow-ips", "*", "--workers", "4"]

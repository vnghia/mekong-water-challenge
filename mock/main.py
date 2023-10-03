import json
from typing import Annotated, Literal, cast

import numpy as np
from fastapi import FastAPI, Query
from fastapi.responses import PlainTextResponse
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam
from pydantic import BaseModel
from sklearn.metrics.pairwise import haversine_distances

app = FastAPI()
openai_client = AsyncOpenAI()

devices = json.load(open("mock/data/devices.json"))
devices_map = {device["id"]: device for device in devices}
device_coordinates = np.array([[device["lat"], device["lng"]] for device in devices])
device_analyses = json.load(open("mock/data/analyses.json"))
news_list = json.load(open("mock/data/news.json"))
contents = json.load(open("mock/data/contents.json"))
news_map = {news["id"]: news for news in news_list}
content_map = {content["id"]: content for content in contents}


class ChatbotMessage(BaseModel):
    role: Literal["assistant", "user"]
    content: str


@app.post("/bot", response_class=PlainTextResponse)
async def get_openai_completion(messages: list[ChatbotMessage]):
    completion = await openai_client.chat.completions.create(
        messages=[
            cast(ChatCompletionMessageParam, message.model_dump())
            for message in messages
        ],
        model="gpt-3.5-turbo",
    )
    return completion.choices[0].message.content


@app.get("/devices")
async def list_devices(
    lat_start: float = 0, lat_end: float = 0, lng_start: float = 0, lng_end: float = 0
):
    return [
        device
        for device in devices
        if (lat_start <= device["lat"] and device["lat"] <= lat_end)
        and (lng_start <= device["lng"] and device["lng"] <= lng_end)
    ]


@app.get("/device")
async def get_nearest_device(lat: float = 0, lng: float = 0):
    distances = haversine_distances(device_coordinates, [[lat, lng]])
    return devices[np.argmin(distances)]


@app.get("/device/{device_id}")
async def get_device(device_id: str):
    return devices_map[device_id]


@app.get("/analyses")
async def get_analyses(device_ids: Annotated[list[str], Query()] = []):
    return [
        device_analysis | devices_map[device_analysis["id"]]
        for device_analysis in device_analyses
        if device_analysis["id"] in device_ids
    ]


@app.get("/news")
async def list_news():
    return news_list


@app.get("/news/{news_id}")
async def get_news(news_id: str):
    return news_map[news_id] | content_map[news_id]

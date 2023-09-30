from typing import Literal, cast

from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam
from pydantic import BaseModel

app = FastAPI()
openai_client = AsyncOpenAI()


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

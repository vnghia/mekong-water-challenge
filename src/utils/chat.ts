import AsyncStorage from "@react-native-async-storage/async-storage"
import OpenAI from "openai"
import { GiftedChat, IMessage, User } from "react-native-gifted-chat"
import uuid from "react-native-uuid"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const UserMap: { [role: string]: User } = {
  bot: {
    _id: "bot",
  },
  user: {
    _id: "user",
  },
} as const

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
})

export const getResponse = async (messages: IMessage[]): Promise<string> => {
  const history = ([] as IMessage[])
    .concat(messages)
    .reverse()
    .slice(1)
    .slice(-10)
    .map(value => ({
      role: value.user._id == UserMap.bot._id ? "assistant" : "user",
      content: value.text,
    })) as OpenAI.Chat.ChatCompletionMessage[]

  const chatCompletion = await openai.chat.completions.create({
    messages: history,
    model: "gpt-3.5-turbo",
  })

  return chatCompletion.choices[0].message.content!
}

type ChatbotMessagesState = {
  messages: IMessage[]
  addMessageText: (text: string, role: "bot" | "user") => void
  addMessages: (messages: IMessage[]) => void
  resetMessages: () => void
}

const initialChatbotMessagesState = {
  messages: [
    {
      _id: uuid.v4().toString(),
      text: "Xin chào tôi có thể giúp gì cho bạn ?",
      createdAt: new Date(),
      user: UserMap.bot,
    } as IMessage,
  ],
}

export const useChatbotMessages = create<ChatbotMessagesState>()(
  persist(
    (set, get) => ({
      ...initialChatbotMessagesState,
      addMessages: messages => {
        set({
          messages: GiftedChat.append(get().messages, messages),
        })
      },
      addMessageText: (text: string, role: "bot" | "user") => {
        get().addMessages([
          {
            _id: uuid.v4().toString(),
            text: text,
            createdAt: new Date(),
            user: UserMap[role],
          },
        ])
      },
      resetMessages: () => {
        set(initialChatbotMessagesState)
      },
    }),
    {
      name: "chatbot-messages-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

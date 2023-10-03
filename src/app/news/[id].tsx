import { fromUnixTime } from "date-fns"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import Markdown from "react-native-markdown-display"
import { apiClient } from "../../utils/api"

type News = {
  id: string
  author: string
  published: Date
  title: string
  content: string
}

export default () => {
  const { id } = useLocalSearchParams()
  const [news, setNews] = useState<News | undefined>()

  const navigation = useNavigation()
  useEffect(() => {
    if (news) {
      navigation.setOptions({
        title: news.title,
      })
    }
  }, [navigation, news])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const newsRaw = (await apiClient.get(`news/${id as string}`)).data as {
        id: string
        author: string
        cover: string
        published: number
        title: string
        content: string
      }
      setNews({
        id: newsRaw.id,
        author: newsRaw.author,
        published: fromUnixTime(newsRaw.published),
        title: newsRaw.title,
        content: newsRaw.content,
      })
    })()
  })

  if (!news) return null

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: "5%",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: "20%",
      }}
    >
      <Markdown>{news.content}</Markdown>
    </ScrollView>
  )
}

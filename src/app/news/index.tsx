import { formatDistance, fromUnixTime } from "date-fns"
import vi from "date-fns/locale/vi"
import { Image } from "expo-image"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { FlatGrid } from "react-native-super-grid"
import { apiClient } from "../../utils/api"

type News = {
  id: string
  author: string
  cover: string
  published: Date
  title: string
}

export default () => {
  const [newsList, setNewsList] = useState<News[]>([])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const newsRaw = (await apiClient.get("/news")).data as {
        id: string
        author: string
        cover: string
        published: number
        title: string
      }[]
      setNewsList(
        newsRaw.map(({ id, author, cover, published, title }) => ({
          id: id,
          author: author,
          cover: cover,
          published: fromUnixTime(published),
          title: title,
        })),
      )
    })()
  }, [])

  return (
    <SafeAreaView>
      <FlatGrid
        itemDimension={130}
        data={newsList}
        keyExtractor={item => item.id}
        spacing={15}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/news/[id]", params: { id: item.id } }}
            asChild
          >
            <TouchableOpacity style={styles.itemContainer}>
              <Image
                cachePolicy="none"
                style={styles.itemCover}
                source={item.cover}
                contentFit="cover"
              />
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemAuthor}>{item.author}</Text>
                <Text style={styles.itemDateDistance}>
                  {formatDistance(item.published, new Date(), { locale: vi })}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        itemContainerStyle={{
          justifyContent: "flex-start",
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
  },
  itemCover: {
    aspectRatio: 1,
    width: "100%",
  },
  itemTextContainer: {},
  itemTitle: {
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "justify",
  },
  itemAuthor: {
    fontFamily: "Inter_400Regular",
    textAlign: "justify",
    color: "gray",
  },
  itemDateDistance: {
    fontFamily: "Inter_400Regular",
    textAlign: "justify",
  },
})

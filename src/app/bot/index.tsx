import "dayjs/locale/vi"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { GiftedChat, IMessage, Send } from "react-native-gifted-chat"
import { SafeAreaView } from "react-native-safe-area-context"
import { UserMap, getResponse, useChatbotMessages } from "../../utils/chat"

export default () => {
  const [isReplying, setIsReplying] = useState(false)

  const [messages, addMessageText, addMessages] = useChatbotMessages(state => [
    state.messages,
    state.addMessageText,
    state.addMessages,
  ])

  useEffect(() => {
    if (isReplying) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      ;(async () => {
        addMessageText(await getResponse(messages), "bot")
        setIsReplying(false)
      })()
    }
  }, [isReplying])

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <GiftedChat
        messages={messages}
        onSend={(new_messages: IMessage[] = []) => {
          addMessages(new_messages)
          setIsReplying(true)
        }}
        alwaysShowSend={true}
        user={UserMap.user}
        placeholder="Nhập tin nhắn"
        locale="vi"
        renderAvatar={null}
        isTyping={isReplying}
        renderSend={props => (
          <Send
            {...props}
            disabled={isReplying}
            label="Gửi"
            textStyle={isReplying ? { color: "#D9D9D9" } : null}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
})

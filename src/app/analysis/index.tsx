import { StyleSheet, Text, View } from "react-native"
import SafeIcon, {
  safeIconAspectRatio,
} from "../../components/analysis/icons/safe"
import WarningIcon, {
  warningIconAspectRatio,
} from "../../components/analysis/icons/warning"

const SummaryIconMap = {
  safe: {
    ratio: safeIconAspectRatio,
    icon: SafeIcon,
    text: "Nguồn nước an toàn",
    color: "#3C94FF",
  },
  warning: {
    ratio: warningIconAspectRatio,
    icon: WarningIcon,
    text: "Báo động đỏ",
    color: "#DE0000",
  },
} as const

export default () => {
  const summaryIconKey = "safe"
  const summaryIconTheme = SummaryIconMap[summaryIconKey]

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View
          style={{
            ...styles.summaryIconContainer,
            aspectRatio: summaryIconTheme.ratio,
          }}
        >
          <summaryIconTheme.icon />
        </View>
        <Text
          style={{
            ...styles.summaryTextContainer,
            color: summaryIconTheme.color,
          }}
        >
          {summaryIconTheme.text}
        </Text>
      </View>
      <View style={styles.graphContainer}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  summaryContainer: {
    flex: 2,
    marginTop: "5%",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  summaryIconContainer: {
    width: "40%",
    alignItems: "center",
  },
  summaryTextContainer: {
    width: "80%",
    marginTop: "5%",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    textAlign: "center",
    textTransform: "uppercase",
  },
  graphContainer: {
    flex: 8,
  },
})

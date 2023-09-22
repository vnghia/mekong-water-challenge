import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, Text } from "react-native"

export default () => {
  return (
    // background: linear-gradient(180deg, #0C428F 0%, #3C94FF 71.35%, #FFF 100%);
    <LinearGradient
      style={styles.background}
      colors={["#0C428F", "#3C94FF", "#FFF"]}
      locations={[0, 0.7135, 1]}
    >
      <Text>JJJJJ</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: { height: "100%", width: "100%" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  locationName: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    fontWeight: "600",
    height: "15%",
    width: "100%",
  },
  qualitySummary: {
    height: "65%",
    width: "100%",
  },
  map: {
    height: "15%",
    width: "30%",
  },
})

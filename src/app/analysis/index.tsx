import { addMonths, format } from "date-fns"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { ClipPath, Defs, Rect } from "react-native-svg"
import { VictoryChart, VictoryLine, VictoryZoomContainer } from "victory-native"
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

const PhysicochemicalParametersProperties = {
  wq: {
    label: "Chất lượng nước",
    yMax: 10,
    threshold: 5,
    reverse: false,
  },
  wl: {
    label: "Mức nước",
    yMax: 100,
    threshold: 70,
    reverse: true,
  },
} as const
type PhysicochemicalParametersName =
  keyof typeof PhysicochemicalParametersProperties

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
const ClipThreshold = ({ ...props }) => {
  const yThreshold = props.scale.y(props.threshold)
  return (
    <Defs key={"clips"}>
      <ClipPath id="clip-path-1">
        <Rect x={"0"} y={0} width={"100%"} height={yThreshold} />
      </ClipPath>
      <ClipPath id={"clip-path-2"}>
        <Rect x={"0"} y={yThreshold} width={"100%"} height={"100%"} />
      </ClipPath>
    </Defs>
  )
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

export default () => {
  const [selectedParameter, setSelectedParameter] =
    useState<PhysicochemicalParametersName>("wq")

  const labelX = Array.from({ length: 25 }).map((_, i) =>
    format(addMonths(new Date(), i - 12), "MM/yy"),
  )

  const physicochemicalData: {
    [key in PhysicochemicalParametersName]: number[]
  } = {
    wq: labelX.map(() => Math.random() * 9 + 1),
    wl: labelX.map(() => Math.random() * 90 + 10),
  }

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
      <View style={styles.graphContainer}>
        <Dropdown
          style={styles.graphSelection}
          selectedTextStyle={styles.graphSelectionItemText}
          itemTextStyle={styles.graphSelectionItemText}
          data={Object.keys(PhysicochemicalParametersProperties).map(k => ({
            label:
              PhysicochemicalParametersProperties[
                k as PhysicochemicalParametersName
              ].label,
            value: k as PhysicochemicalParametersName,
          }))}
          labelField="label"
          valueField="value"
          value={selectedParameter}
          onChange={property => {
            setSelectedParameter(property.value)
          }}
        />
        <VictoryChart
          minDomain={{ y: 0 }}
          maxDomain={{
            y: PhysicochemicalParametersProperties[selectedParameter].yMax,
          }}
          containerComponent={
            <VictoryZoomContainer
              allowZoom={false}
              zoomDimension="x"
              zoomDomain={{ x: [12, 18] }}
            />
          }
        >
          <VictoryLine
            style={{
              data: {
                stroke: PhysicochemicalParametersProperties[selectedParameter]
                  .reverse
                  ? SummaryIconMap.warning.color
                  : SummaryIconMap.safe.color,
                strokeWidth: 2.75,
                clipPath: "url(#clip-path-1)",
              },
            }}
            data={physicochemicalData[selectedParameter].map((v, i) => ({
              x: labelX[i],
              y: v,
            }))}
          />
          <VictoryLine
            style={{
              data: {
                stroke: PhysicochemicalParametersProperties[selectedParameter]
                  .reverse
                  ? SummaryIconMap.safe.color
                  : SummaryIconMap.warning.color,
                strokeWidth: 2.75,
                clipPath: "url(#clip-path-2)",
              },
            }}
            data={physicochemicalData[selectedParameter].map((v, i) => ({
              x: labelX[i],
              y: v,
            }))}
          />
          <ClipThreshold
            threshold={
              PhysicochemicalParametersProperties[selectedParameter].threshold
            }
          />
        </VictoryChart>
      </View>
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
    flex: 3,
    marginTop: "5%",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  summaryIconContainer: {
    maxHeight: "80%",
    alignItems: "center",
  },
  summaryTextContainer: {
    width: "80%",
    maxHeight: "20%",
    marginTop: "5%",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    textAlign: "center",
    textTransform: "uppercase",
  },
  graphContainer: {
    flex: 7,
    marginTop: "10%",
    width: "100%",
    alignItems: "center",
  },
  graphSelection: {
    width: "80%",
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,
  },
  graphSelectionItemText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
})

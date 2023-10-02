import { LinearGradient } from "expo-linear-gradient"
import { Fragment, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import MapView, { Marker } from "react-native-maps"
import Svg, {
  Defs,
  ForeignObject,
  LinearGradient as LinearGradientSvg,
  Path,
  Stop,
} from "react-native-svg"
import {
  DeviceAnalysis,
  getDeviceAnalyses,
  listDevicesInRegion,
  useDevice,
} from "../utils/device"

const WaterQualityThemeMap = {
  good: {
    lg: {
      colors: ["#0C428F", "#3C94FF", "#FFF"],
      locations: [0, 0.7135, 1],
    },
    lgsvg: {
      start: "#0065B3",
      stop: "#69BDFD",
    },
    status: "Tốt",
  },
  normal: {
    lg: {
      colors: ["#D89B00", "#E8D000", "#FFF"],
      locations: [0, 0.6094, 1],
    },
    lgsvg: {
      start: "#BF8A00",
      stop: "#FDC269",
    },
    status: "Bình thường",
  },
  bad: {
    lg: {
      colors: ["#A70000", "#E84E4E", "#FFF"],
      locations: [0, 0.4792, 1],
    },
    lgsvg: {
      start: "#7E0000",
      stop: "#FD6969",
    },
    status: "Xấu",
  },
}

const getWaterQualityTheme = (waterQuality: number) => {
  return WaterQualityThemeMap[
    waterQuality >= 8.0 ? "good" : waterQuality >= 4.0 ? "normal" : "bad"
  ]
}

export default () => {
  const [device, setDevice] = useDevice(state => [
    state.device,
    state.setDevice,
  ])
  const [waterQuality, setWaterQuality] = useState(0)
  const waterQualityTheme = getWaterQualityTheme(waterQuality)

  useEffect(() => {
    if (device) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      ;(async () => {
        setWaterQuality((await getDeviceAnalyses([device]))[0].wq)
      })()
    }
  }, [device])

  const map = useRef<MapView | null>(null)
  const [isMapReady, setMapReady] = useState(false)
  const [qualityMarkers, setQualityMarkers] = useState<DeviceAnalysis[]>([])

  useEffect(() => {
    if (device && map.current) {
      map.current.animateToRegion({
        latitude: device.lat,
        longitude: device.lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      })
    }
  }, [device, isMapReady])

  if (!waterQuality) return null

  return (
    <LinearGradient style={styles.container} {...waterQualityTheme.lg}>
      {waterQuality ? (
        <Fragment>
          <View style={styles.qualityNumberContainer}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 227 268"
              preserveAspectRatio="xMinYMin slice"
            >
              <Path
                d="M122.36 4.72599L192.82 75.1855C236.701 119.067 236.701 190.213 192.82 234.095C148.938 277.976 77.7925 277.976 33.9112 234.095C-9.97039 190.213 -9.97039 119.067 33.9112 75.1855L104.371 4.72576C109.338 -0.241958 117.393 -0.241958 122.36 4.72599Z"
                fill="url(#water_drop_linear_gradient)"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ForeignObject
                x={26}
                y={70}
                width={styles.qualityNumber.width}
                height={styles.qualityNumber.height}
                key={waterQuality}
              >
                <Text style={styles.qualityNumber}>
                  {waterQuality.toFixed(1)}
                </Text>
              </ForeignObject>
              <ForeignObject
                x={38}
                y={185}
                width={styles.qualityNumberDescription.width}
                height={styles.qualityNumberDescription.height}
              >
                <Text style={styles.qualityNumberDescription}>
                  Chất lượng nước trung bình hôm nay
                </Text>
              </ForeignObject>
              <Defs>
                <LinearGradientSvg
                  id="water_drop_linear_gradient"
                  x1={113.366}
                  y1={1}
                  x2={113.366}
                  y2={267.006}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor={waterQualityTheme.lgsvg.start} />
                  <Stop
                    offset={1}
                    stopColor={waterQualityTheme.lgsvg.stop}
                    stopOpacity={0}
                  />
                </LinearGradientSvg>
              </Defs>
            </Svg>
          </View>
          <View style={styles.qualitySummaryContainer}>
            <Text style={styles.qualitySummaryStatus}>
              Đánh giá: {waterQualityTheme.status}
            </Text>
          </View>
        </Fragment>
      ) : null}
      <MapView
        style={styles.mapContainer}
        ref={map}
        mapType="satellite"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onRegionChangeComplete={async region => {
          const devices = await listDevicesInRegion(region)
          setQualityMarkers(await getDeviceAnalyses(devices))
        }}
        onMapReady={() => setMapReady(true)}
      >
        {qualityMarkers.map(value => (
          <Marker
            key={value.id}
            coordinate={{
              latitude: value.lat,
              longitude: value.lng,
            }}
            onPress={() => {
              setDevice({
                id: value.id,
                lat: value.lat,
                lng: value.lng,
                name: value.name,
              })
            }}
            pinColor={getWaterQualityTheme(value.wq).lgsvg.stop}
          />
        ))}
      </MapView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  qualityNumberContainer: {
    flex: 4,
    alignItems: "center",
    marginTop: "10%",
    aspectRatio: 227 / 268,
  },
  qualityNumber: {
    height: 100,
    width: 172,
    color: "#FFF",
    fontSize: 90,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    textAlign: "center",
  },
  qualityNumberDescription: {
    height: 50,
    width: 150,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    textAlign: "center",
  },
  qualitySummaryContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
  },
  qualitySummaryStatus: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    textAlign: "center",
  },
  mapContainer: {
    flex: 5,
    marginTop: "10%",
    width: "100%",
    height: "100%",
  },
})

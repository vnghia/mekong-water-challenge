/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter"
import { Octicons } from "@expo/vector-icons"
import { Overlay, ThemeProvider, createTheme, lightColors } from "@rneui/themed"
import { SplashScreen } from "expo-router"
import { Tabs } from "expo-router/tabs"
import { useEffect, useState } from "react"
import { Platform, StyleSheet } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  HeaderButton,
  HeaderButtons,
  HeaderButtonsProvider,
} from "react-navigation-header-buttons"
import * as LocationUtils from "../utils/location"

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
})

const TabsLocationHeader = [
  { path: "", iconName: "home", label: "Tổng quan hôm nay" },
  { path: "analysis/", iconName: "graph", label: "Phân tích chi tiết" },
] as const

SplashScreen.preventAutoHideAsync()

export default () => {
  // Load font
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  // Location header
  const [isSearching, setSearching] = useState(false)
  const [coordsAndName, setCoordsAndName] = LocationUtils.useCoordsAndName(
    state => [state.coordsAndName, state.setCoordsAndName],
  )

  useEffect(() => {
    ;(async () => {
      if (!coordsAndName) {
        const userCoordsAndName =
          await LocationUtils.getUserLocationAndName(false)
        if (userCoordsAndName) {
          setCoordsAndName(userCoordsAndName.coords, userCoordsAndName.name)
        }
      }
    })()
  }, [])

  const locationHeaderRight = () => (
    <HeaderButtons>
      <HeaderButton
        title="location"
        renderButton={() => {
          return <Octicons name="location" size={24} color="#000" />
        }}
        onPress={() => {
          ;(async () => {
            const userCoordsAndName =
              await LocationUtils.getUserLocationAndName(true)
            if (userCoordsAndName) {
              setCoordsAndName(userCoordsAndName.coords, userCoordsAndName.name)
            }
          })()
        }}
      />
      <HeaderButton
        title="search"
        renderButton={() => {
          return <Octicons name="search" size={24} color="#000" />
        }}
        onPress={() => setSearching(true)}
      />
    </HeaderButtons>
  )

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Overlay
          isVisible={isSearching}
          animationType="slide"
          onPressOut={() => setSearching(false)}
          overlayStyle={styles.searchContainer}
        >
          <GooglePlacesAutocomplete
            placeholder="Tìm địa điểm"
            onPress={(_, details) => {
              setCoordsAndName(
                details!.geometry.location,
                details!.address_components
                  .slice(0, 2)
                  .map(a => a.short_name)
                  .join(", "),
              )
              setSearching(false)
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
              language: "vi",
              components: "country:vn",
            }}
            fetchDetails={true}
            GooglePlacesDetailsQuery={{
              fields: "address_components,geometry",
            }}
          />
        </Overlay>
        <HeaderButtonsProvider stackType="js">
          <Tabs>
            {TabsLocationHeader.map(value => (
              <Tabs.Screen
                key={value.path}
                name={`${value.path}index`}
                options={{
                  title: coordsAndName?.name,
                  headerTitleStyle: styles.locationName,
                  tabBarLabel: value.label,
                  tabBarIcon: ({ color, size }) => (
                    <Octicons name={value.iconName} color={color} size={size} />
                  ),
                  headerRight: locationHeaderRight,
                }}
              />
            ))}
            <Tabs.Screen
              name="bot/index"
              options={{
                headerShown: false,
                tabBarLabel: "Tư vấn 1:1",
                tabBarIcon: ({ color, size }) => (
                  <Octicons name="dependabot" color={color} size={size} />
                ),
              }}
            />
          </Tabs>
        </HeaderButtonsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  locationName: {
    fontFamily: "Inter_400Regular",
  },
  searchContainer: {
    width: "80%",
    height: "80%",
  },
})

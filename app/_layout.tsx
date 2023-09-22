/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter"
import { Octicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Overlay, ThemeProvider, createTheme, lightColors } from "@rneui/themed"
import geocoder from "@timwangdev/react-native-geocoder"
import * as LocationUtils from "expo-location"
import { Tabs } from "expo-router/tabs"
import * as SplashScreen from "expo-splash-screen"
import { useCallback, useEffect, useState } from "react"
import { Platform, StyleSheet } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import {
  HeaderButton,
  HeaderButtons,
  HeaderButtonsProvider,
} from "react-navigation-header-buttons"

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
})

const GeoCodingExtractOrder = [
  "feature",
  "subLocality",
  "locality",
  "subAdminArea",
  "adminArea",
] as const

SplashScreen.preventAutoHideAsync()

export default () => {
  // Load font
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  })
  useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // Location header
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState<
    | {
        lat: number
        lng: number
      }
    | undefined
  >()
  const [locationName, setLocationName] = useState("Việt Nam")
  const [isSearching, setSearching] = useState(false)

  const retrieveUserLocation = async () => {
    const { status } = await LocationUtils.requestForegroundPermissionsAsync()
    if (status) {
      const userPosition = await LocationUtils.getLastKnownPositionAsync({})
      if (userPosition) {
        const userLocation = {
          lat: userPosition.coords.latitude,
          lng: userPosition.coords.longitude,
        }

        const geocodingInfo = (
          await geocoder.geocodePosition(userLocation, {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
            locale: "vi",
            fallbackToGoogle: true,
            forceGoogleOnIos: true,
          })
        )[0]

        const addressComponents = []
        for (let i = 0; i < GeoCodingExtractOrder.length; ++i) {
          const geocodingValue = geocodingInfo[GeoCodingExtractOrder[i]]
          if (geocodingValue) addressComponents.push(geocodingValue)
          if (addressComponents.length == 2) break
        }

        setLocationName(addressComponents.join(", "))
        setLocation(userLocation)
      }
    }
  }

  useEffect(() => {
    const retrieveLocation = async () => {
      const locationInfoString = await AsyncStorage.getItem("location")
      if (locationInfoString) {
        const locationInfo = JSON.parse(locationInfoString) as {
          location: { lat: number; lng: number }
          locationName: string
        }

        setLocationName(locationInfo.locationName)
        setLocation(locationInfo.location)
      } else {
        await retrieveUserLocation()
      }
    }
    retrieveLocation()
  }, [])

  useEffect(() => {
    const saveLocationInfo = async () => {
      if (location) {
        await AsyncStorage.setItem(
          "location",
          JSON.stringify({ location, locationName }),
        )
      }
    }
    saveLocationInfo()
  }, [location, locationName])

  const locationHeaderRight = () => (
    <HeaderButtons>
      <HeaderButton
        title="location"
        renderButton={() => {
          return <Octicons name="location" size={24} color="#000" />
        }}
        onPress={() => {
          retrieveUserLocation()
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

  if (!fontsLoaded) {
    return null
  }

  return (
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
            setLocation(details!.geometry.location)
            setLocationName(
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
          <Tabs.Screen
            name="home/index"
            options={{
              title: locationName,
              headerTitleStyle: styles.locationName,
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <Octicons name="home" color={color} size={size} />
              ),
              headerRight: locationHeaderRight,
            }}
          />
        </Tabs>
      </HeaderButtonsProvider>
    </ThemeProvider>
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

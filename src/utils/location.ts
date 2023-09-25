import AsyncStorage from "@react-native-async-storage/async-storage"
import geocoder from "@timwangdev/react-native-geocoder"
import * as Location from "expo-location"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type Coords = {
  lat: number
  lng: number
}

export type CoordsAndName = {
  coords: Coords
  name: string
}

export const getUserLocation = async (
  getCurrentPosition: boolean = false,
): Promise<Coords | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status) {
    const position = getCurrentPosition
      ? await Location.getCurrentPositionAsync({})
      : await Location.getLastKnownPositionAsync({})

    if (position) {
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    }
  }

  return null
}

const GeocodingExtractOrder = [
  "feature",
  "subLocality",
  "locality",
  "subAdminArea",
  "adminArea",
] as const

export const getGeocodingReverse = async (coords: Coords): Promise<string> => {
  const geocoding = (
    await geocoder.geocodePosition(coords, {
      apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
      locale: "vi",
      fallbackToGoogle: true,
      forceGoogleOnIos: true,
    })
  )[0]

  const components = []
  for (let i = 0; i < GeocodingExtractOrder.length; ++i) {
    const value = geocoding[GeocodingExtractOrder[i]]
    if (value) components.push(value)
    if (components.length == 2) break
  }

  return components.join(", ")
}

export const getUserLocationAndName = async (
  getCurrentPosition: boolean = false,
): Promise<CoordsAndName | null> => {
  const coords = await getUserLocation(getCurrentPosition)
  if (coords) {
    const name = await getGeocodingReverse(coords)
    return { coords, name }
  }
  return null
}

type CoordsAndNameState = {
  coordsAndName: CoordsAndName | null
  setCoordsAndName: (coords: Coords, name: string) => void
}

export const useCoordsAndName = create<CoordsAndNameState>()(
  persist(
    set => ({
      coordsAndName: null,
      setCoordsAndName: (coords: Coords, name: string) =>
        set({ coordsAndName: { coords, name } }),
    }),
    {
      name: "coords-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

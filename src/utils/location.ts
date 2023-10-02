import * as Location from "expo-location"

export type Coords = {
  lat: number
  lng: number
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

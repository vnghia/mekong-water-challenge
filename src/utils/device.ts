import AsyncStorage from "@react-native-async-storage/async-storage"
import { Region } from "react-native-maps"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { apiClient } from "./api"

export type Device = {
  id: string
  lat: number
  lng: number
  name: string
}

export type DeviceAnalysis = Device & {
  wq: number
}

type DeviceState = {
  device: Device | null
  setDeviceCoord: (lat: number, lng: number) => Promise<void>
  setDeviceId: (device_id: string) => Promise<void>
  setDevice: (device: Device) => void
}

export const useDevice = create<DeviceState>()(
  persist(
    set => ({
      device: null,
      setDeviceCoord: async (lat: number, lng: number) => {
        set({
          device: (await apiClient.get("/device", { params: { lat, lng } }))
            .data as Device,
        })
      },
      setDeviceId: async (device_id: string) => {
        set({
          device: (await apiClient.get(`/device/${device_id}`)).data as Device,
        })
      },
      setDevice: (device: Device) => {
        set({ device: device })
      },
    }),
    {
      name: "device-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export const listDevicesInRegion = async (
  region: Region,
): Promise<Device[]> => {
  const lat_start = region.latitude - region.latitudeDelta / 2
  const lat_end = region.latitude + region.latitudeDelta / 2
  const lng_start = region.longitude - region.longitudeDelta / 2
  const lng_end = region.longitude + region.longitudeDelta / 2
  return (
    await apiClient.get("/devices", {
      params: { lat_start, lat_end, lng_start, lng_end },
    })
  ).data as Device[]
}

export const getDeviceAnalyses = async (
  devices: Device[],
): Promise<DeviceAnalysis[]> => {
  return (
    await apiClient.get("/analyses", {
      params: { device_ids: devices.map(d => d.id) },
      paramsSerializer: {
        indexes: null,
      },
    })
  ).data as DeviceAnalysis[]
}

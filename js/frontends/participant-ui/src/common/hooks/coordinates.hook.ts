import { LocationObject } from 'expo-location/src/Location.types'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

interface Coordinates {
  lat?: number
  lng?: number
}

export const useCoordinates = (): Coordinates => {
  const [locationObject, setLocationObject] = useState<LocationObject | undefined>(undefined)

  useEffect(() => {
    void fetchLocation(setLocationObject)
  }, [])

  if (locationObject === undefined) {
    return {}
  }

  return {
    lat: locationObject.coords.latitude,
    lng: locationObject.coords.longitude
  }
}

const fetchLocation = async (setLocationObject: (o: LocationObject) => void): Promise<void> => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    return
  }

  const o = await Location.getCurrentPositionAsync()
  setLocationObject(o)
}

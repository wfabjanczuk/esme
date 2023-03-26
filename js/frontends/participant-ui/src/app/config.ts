import { Platform } from 'react-native'

const isIos = Platform.OS === 'ios'
const localhost = isIos ? 'localhost' : '10.0.2.2'

export const config = {
  organizerApiUrl: `http://${localhost}:8000`,
  participantApiUrl: `http://${localhost}:8100`,
  messengerApiUrl: `ws://${localhost}:8300`
}

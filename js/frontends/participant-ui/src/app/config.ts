import { Platform } from 'react-native'

const isIos = Platform.OS === 'ios'
const localhost = isIos ? 'localhost' : '10.0.2.2'

export const config = {
  participantApiUrl: `http://${localhost}:8100`,
  messengerWsUrl: `ws://${localhost}:8300`
}

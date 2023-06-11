import cfg from '../../config.json'

export const config = {
  participantApiUrl: cfg.participant_api_url,
  messengerApiUrl: cfg.messenger_api_url,
  messengerWsUrl: cfg.messenger_ws_url
}

/**
 * For local development with Android and iOS at the same time, you can use the following config:
 *
 * import { Platform } from 'react-native'
 *
 * const isIos = Platform.OS === 'ios'
 * const localhost = isIos ? 'localhost' : '10.0.2.2'
 *
 * export const config = {
 *   participantApiUrl: `http://${localhost}:8100`,
 *   messengerApiUrl: `http://${localhost}:8300`,
 *   messengerWsUrl: `ws://${localhost}:8300`
 * }
 */

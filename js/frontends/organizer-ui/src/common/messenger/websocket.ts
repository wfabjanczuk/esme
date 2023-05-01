import React from 'react'
import { Action } from './structures'
import { config } from '../../app/config'
import { AlertStore } from '../alert-bar/alert-store.context'

const connectUrl = `${config.messengerWsUrl}/connect`

export const newWebSocket = (
  authorizationHeader: string,
  dispatch: React.Dispatch<Action>,
  alertStore: AlertStore,
  onOpen: () => void,
  onClose: () => void
): WebSocket => {
  const webSocket = new WebSocket(connectUrl)

  webSocket.addEventListener('open', onOpen)

  webSocket.addEventListener('message', (e) => {
    dispatch(JSON.parse(e.data))
  })

  webSocket.addEventListener('error', () => {
    alertStore.add('error', 'WebSocket error')
  })

  webSocket.addEventListener('close', onClose)

  return webSocket
}

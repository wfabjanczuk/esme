import React from 'react'
import { Action } from './structures'
import { config } from '../../app/config'

const connectUrl = `${config.messengerApiUrl}/connect`

export const newWebSocket = (
  authorizationHeader: string,
  dispatch: React.Dispatch<Action>,
  onOpen: () => void,
  onClose: () => void
): WebSocket => {
  const webSocket = new WebSocket(connectUrl)

  webSocket.addEventListener('open', onOpen)

  webSocket.addEventListener('message', (e) => {
    dispatch(JSON.parse(e.data))
  })

  webSocket.addEventListener('error', (e) => {
    console.log(e)
  })

  webSocket.addEventListener('close', (e) => {
    onClose()
  })

  return webSocket
}

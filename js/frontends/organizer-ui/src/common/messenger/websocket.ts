import React from 'react'
import { Action } from './structures'
import { config } from '../../app/config'

const connectUrl = `${config.messengerApiUrl}/connect`

export const newWebSocket = (
  authorizationHeader: string,
  dispatch: React.Dispatch<Action>
): WebSocket => {
  const webSocket = new WebSocket(connectUrl)

  webSocket.addEventListener('open', () => {
    webSocket.send(JSON.stringify({
      Authorization: authorizationHeader
    }))
  })

  webSocket.addEventListener('message', (e) => {
    dispatch(JSON.parse(e.data))
  })

  webSocket.addEventListener('error', (e) => {
    console.log(e)
  })

  webSocket.addEventListener('close', (e) => {
    console.log(e)
  })

  return webSocket
}

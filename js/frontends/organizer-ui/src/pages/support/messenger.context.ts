import React from 'react'
import { config } from '../../app/config'
import { AlertStore } from '../../common/alert-bar/alert-store.context'
import { Chat } from './chat'

const connectUrl = `${config.messengerUrl}/connect`
const emptySetState = (): void => {}

export class Messenger {
  constructor (
    private readonly setState: (messenger: Messenger) => void = emptySetState,
    private readonly alertStore: AlertStore = new AlertStore(),
    private readonly authorizationHeader: string = '',
    private readonly webSocket: WebSocket = new WebSocket(connectUrl),
    private readonly chats: Chat[] = []
  ) {
    if (!this.hasState()) {
      this.webSocket.close()
    }
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  initialize (): void {
    this.mountListeners()
  }

  private mountListeners (): void {
    this.webSocket.addEventListener('open', () => {
      this.webSocket.send(JSON.stringify({
        Authorization: this.authorizationHeader
      }))
      this.webSocket.send(JSON.stringify({
        type: 'get_chats',
        payload: ''
      }))
    })

    this.webSocket.addEventListener('message', (e) => {
      console.log(e)
      this.alertStore.add('success', 'New message')
    })

    this.webSocket.addEventListener('error', (e) => {
      console.log(e)
      this.alertStore.add('error', 'Messenger error')
    })

    this.webSocket.addEventListener('close', (e) => {
      console.log(e)
      this.alertStore.add('error', 'Messenger close')
    })
  }

  private update (): void {
    this.setState(new Messenger(this.setState, this.alertStore, this.authorizationHeader, this.webSocket, this.chats))
  }
}

export const MessengerContext = React.createContext<Messenger>(new Messenger())

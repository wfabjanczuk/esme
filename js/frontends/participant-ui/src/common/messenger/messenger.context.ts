import React, { Dispatch, SetStateAction } from 'react'
import { Action } from './structures'
import { newWebSocket } from './websocket'

const emptySetState = (): void => {
}

export class Messenger {
  constructor (
    private readonly setState: Dispatch<SetStateAction<Messenger>> = emptySetState,
    private webSocket: WebSocket = undefined as unknown as WebSocket
  ) {
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  isInitialized (): boolean {
    return this.webSocket?.readyState === WebSocket.OPEN
  }

  initialize (authorizationHeader: string, dispatch: React.Dispatch<Action>): void {
    if (this.webSocket !== undefined && this.webSocket.readyState !== WebSocket.CLOSED) {
      return
    }

    this.webSocket = newWebSocket(authorizationHeader, dispatch,
      () => {
        this.webSocket.send(JSON.stringify({
          Authorization: authorizationHeader
        }))
        this.refreshState()
      },
      () => this.refreshState()
    )
  }

  getChats (): void {
    this.webSocket.send(JSON.stringify({
      type: 'get_chats',
      payload: ''
    }))
  }

  getChatHistory (chatId: string): void {
    this.webSocket.send(JSON.stringify({
      type: 'get_chat_history',
      payload: { chatId }
    }))
  }

  sendMessage (chatId: string, message: string): void {
    this.webSocket.send(JSON.stringify({
      type: 'send_message',
      payload: {
        chatId,
        message
      }
    }))
  }

  private refreshState (): void {
    this.setState(new Messenger(this.setState, this.webSocket))
  }
}

export const MessengerContext = React.createContext<Messenger>(new Messenger())

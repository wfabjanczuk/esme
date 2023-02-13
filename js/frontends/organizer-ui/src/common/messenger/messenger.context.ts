import React from 'react'
import { Action } from './structures'
import { newWebSocket } from './websocket'

export class Messenger {
  private webSocket: WebSocket
  private dispatch: React.Dispatch<Action>

  constructor () {
    this.webSocket = undefined as unknown as WebSocket
    this.dispatch = undefined as unknown as React.Dispatch<Action>
  }

  isInitialized (): boolean {
    return this.webSocket !== undefined && this.dispatch !== undefined
  }

  setDispatch (dispatch: React.Dispatch<Action>): void {
    this.dispatch = dispatch
  }

  connect (authorizationHeader: string): void {
    if (this.webSocket !== undefined) {
      this.webSocket.close()
    }
    this.webSocket = newWebSocket(authorizationHeader, this.dispatch)
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
      payload: { chatId, message }
    }))
  }
}

export const MessengerContext = React.createContext<Messenger>(new Messenger())

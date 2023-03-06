import React from 'react'
import { Action } from './structures'
import { newWebSocket } from './websocket'

export class Messenger {
  private webSocket: WebSocket = undefined as unknown as WebSocket

  isInitialized (): boolean {
    return this.webSocket?.readyState === WebSocket.OPEN
  }

  initialize (authorizationHeader: string, dispatch: React.Dispatch<Action>): void {
    if (this.isInitialized()) {
      this.webSocket.close()
    }
    this.webSocket = newWebSocket(authorizationHeader, dispatch)
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

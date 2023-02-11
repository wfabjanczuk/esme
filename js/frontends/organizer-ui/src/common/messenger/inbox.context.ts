import React, { Reducer } from 'react'
import { Action, ActionType, Chat, Message } from './structures'

export const emptyInbox: Inbox = {
  chats: [],
  messages: {}
}

export interface Inbox {
  chats: Chat[]
  messages: {
    [chatId: string]: Message[]
  }
}

export const InboxReducer: Reducer<Inbox, Action> = (state, action) => {
  switch (action.type) {
  case ActionType.info:
  case ActionType.error:
    console.log(action.type, action.payload)
    return state
  case ActionType.chats:
    return {
      ...state,
      chats: action.payload.chats
    }
  case ActionType.chatHistory:
    return {
      ...state,
      messages: {
        ...state.messages,
        [action.payload.chatId]: action.payload.messages
      }
    }
  case ActionType.newChat:
    return {
      ...state,
      chats: [...state.chats, action.payload]
    }
  case ActionType.userMessage: {
    const { chatId } = action.payload
    const chatMessages = state.messages[chatId]

    return {
      ...state,
      messages: {
        ...state.messages,
        [chatId]: [...chatMessages, action.payload]
      }
    }
  }
  }
}

export const InboxContext = React.createContext<Inbox>(emptyInbox)

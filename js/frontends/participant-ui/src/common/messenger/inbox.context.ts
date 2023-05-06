import React, { Reducer } from 'react'
import { Action, ActionType, Chat, Message } from './structures'
import { AlertStore } from '../alert-bar/alert-store.context'

export const emptyInbox: Inbox = {
  callbacks: [],
  chats: new Map<string, Chat>(),
  messages: new Map<string, Message[]>()
}

export interface Inbox {
  callbacks: Array<() => void>
  chats: Map<string, Chat>
  messages: Map<string, Message[]>
}

export const NewInboxReducer: (alertStore: AlertStore) => Reducer<Inbox, Action> = (alertStore: AlertStore) => (state, action) => {
  switch (action.type) {
  case ActionType.info:
    return state
  case ActionType.error: {
    const callbacks = [...state.callbacks, () => alertStore.add('error', action.payload.message)]
    return {
      ...state,
      callbacks
    }
  }
  case ActionType.chats: {
    const chats = new Map<string, Chat>()
    action.payload.chats.forEach(chat => chats.set(chat.id, chat))

    return {
      ...state,
      chats
    }
  }
  case ActionType.chatHistory: {
    const messages = new Map(state.messages)
    messages.set(action.payload.chatId, action.payload.messages)

    return {
      ...state,
      messages
    }
  }
  case ActionType.newChat: {
    const callbacks = [...state.callbacks, () => alertStore.add('success', 'New chat started')]
    const chats = new Map(state.chats)
    chats.set(action.payload.id, action.payload)

    return {
      ...state,
      callbacks,
      chats
    }
  }
  case ActionType.closedChat: {
    const callbacks = [...state.callbacks, () => alertStore.add('warning', 'Chat has ended')]
    const { chatId } = action.payload

    const chats = new Map(state.chats)
    const messages = new Map(state.messages)
    chats.delete(chatId)
    messages.delete(chatId)

    return {
      ...state,
      callbacks,
      chats,
      messages
    }
  }
  case ActionType.userMessage: {
    const { chatId } = action.payload
    const chatMessages = state.messages.get(chatId) ?? []
    const messages = new Map(state.messages)
    messages.set(chatId, [...chatMessages, action.payload])

    return {
      ...state,
      messages
    }
  }
  }
}

export const InboxContext = React.createContext<Inbox>(emptyInbox)

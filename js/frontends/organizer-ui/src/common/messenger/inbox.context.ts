import React, { Reducer } from 'react'
import { Action, ActionType, Chat, Location, Message } from './structures'
import { AlertStore } from '../alert-bar/alert-store.context'

export const emptyInbox: Inbox = {
  chats: {},
  messages: {}
}

export interface Inbox {
  chats: {
    [chatId: string]: Chat
  }
  messages: {
    [chatId: string]: Message[]
  }
}

export const NewInboxReducer: (alertStore: AlertStore) => Reducer<Inbox, Action> = (alertStore: AlertStore) => (state, action) => {
  switch (action.type) {
  case ActionType.info:
    alertStore.add('success', action.payload.message)
    return state
  case ActionType.error:
    alertStore.add('error', action.payload.message)
    return state
  case ActionType.chats: {
    for (const chat of action.payload.chats) {
      if (chat.latStart != null && chat.lngStart != null) {
        state.chats[chat.id] = {
          ...chat,
          location: {
            lat: chat.latStart,
            lng: chat.lngStart
          }
        }
      }
    }

    return {
      chats: { ...state.chats },
      messages: state.messages
    }
  }
  case ActionType.chatHistory: {
    const chatId = action.payload.chatId
    const location = getLastLocationFromMessages(action.payload.messages)

    let chats = state.chats
    if (location !== undefined) {
      state.chats[chatId] = {
        ...state.chats[chatId],
        location
      }
      chats = { ...state.chats }
    }

    return {
      chats,
      messages: {
        ...state.messages,
        [action.payload.chatId]: action.payload.messages
      }
    }
  }
  case ActionType.newChat: {
    const chat = action.payload
    if (chat.latStart != null && chat.lngStart != null) {
      chat.location = {
        lat: chat.latStart,
        lng: chat.lngStart
      }
    }

    return {
      chats: {
        ...state.chats,
        [chat.id]: chat
      },
      messages: state.messages
    }
  }
  case ActionType.userMessage: {
    const {
      chatId,
      lat,
      lng,
      fromOrganizer
    } = action.payload
    const chatMessages = state.messages[chatId] ?? []

    let chats = state.chats
    if (fromOrganizer === 0 && lat != null && lng != null) {
      state.chats[chatId] = {
        ...state.chats[chatId],
        location: {
          lat,
          lng
        }
      }
      chats = { ...state.chats }
    }

    return {
      chats,
      messages: {
        ...state.messages,
        [chatId]: [...chatMessages, action.payload]
      }
    }
  }
  }
}

const getLastLocationFromMessages = (messages: Message[]): Location | undefined => {
  const last = messages.length - 1
  for (let i = last; i >= 0; i--) {
    const msg = messages[i]
    if (msg.lat != null && msg.lng != null) {
      return {
        lat: msg.lat,
        lng: msg.lng
      }
    }
  }

  return undefined
}

export const InboxContext = React.createContext<Inbox>(emptyInbox)

import React, { Reducer } from 'react'
import { Action, ActionType, Chat, Message } from './structures'
import { AlertStore } from '../alert-bar/alert-store.context'
import { getLastLocationFromMessages } from '../utils'

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
      state.chats[chat.id] = chat

      if (chat.latStart != null && chat.lngStart != null) {
        state.chats[chat.id].location = {
          lat: chat.latStart,
          lng: chat.lngStart
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

export const InboxContext = React.createContext<Inbox>(emptyInbox)

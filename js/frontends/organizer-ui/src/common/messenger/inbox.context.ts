import React, { Reducer } from 'react'
import { Action, ActionType, Chat, Message } from './structures'
import { AlertStore } from '../alert-bar/alert-store.context'
import { getLastLocationFromMessages } from '../utils'

export const emptyInbox: Inbox = {
  callbacks: [],
  chatsCount: 0,
  chats: new Map<string, Chat>(),
  messages: new Map<string, Message[]>()
}

export interface Inbox {
  callbacks: Array<() => void>
  chatsCount: number
  chats: Map<string, Chat>
  messages: Map<string, Message[]>
}

export const NewInboxReducer: (alertStore: AlertStore) => Reducer<Inbox, Action> =
  (alertStore: AlertStore) => (state, action) => {
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
      const messages = new Map<string, Message[]>()

      for (const chat of action.payload.chats) {
        chats.set(chat.id, chat)
        const chatMessages = state.messages.get(chat.id)
        if (chatMessages !== undefined) {
          messages.set(chat.id, chatMessages)
        }

        if (chat.latStart != null && chat.lngStart != null) {
          const chatToUpdate = chats.get(chat.id)
          if (chatToUpdate === undefined) {
            continue
          }

          chatToUpdate.location = {
            lat: chat.latStart,
            lng: chat.lngStart
          }
        }
      }

      return {
        ...state,
        chats,
        messages
      }
    }
    case ActionType.chatHistory: {
      const chatId = action.payload.chatId
      const location = getLastLocationFromMessages(action.payload.messages)

      let chats = state.chats
      if (location !== undefined) {
        const chatToUpdate = chats.get(chatId)
        if (chatToUpdate !== undefined) {
          chats.set(chatId, {
            ...chatToUpdate,
            location
          })
          chats = new Map(state.chats)
        }
      }

      const messages = new Map(state.messages)
      messages.set(chatId, action.payload.messages)

      return {
        ...state,
        chats,
        messages
      }
    }
    case ActionType.newChat: {
      const callbacks = [...state.callbacks, () => alertStore.add('success', 'New chat started')]
      const chat = action.payload
      if (chat.latStart != null && chat.lngStart != null) {
        chat.location = {
          lat: chat.latStart,
          lng: chat.lngStart
        }
      }

      const chats = new Map(state.chats)
      chats.set(chat.id, chat)

      return {
        ...state,
        callbacks,
        chatsCount: state.chatsCount + 1,
        chats
      }
    }
    case ActionType.closedChat: {
      const chatId = action.payload.chatId
      const chatToDelete = state.chats.get(chatId)
      if (chatToDelete === undefined) {
        return state
      }

      const chats = new Map(state.chats)
      const messages = new Map(state.messages)
      chats.delete(chatId)
      messages.delete(chatId)

      return {
        ...state,
        chats,
        messages
      }
    }
    case ActionType.userMessage: {
      const {
        chatId,
        lat,
        lng,
        fromOrganizer
      } = action.payload
      const chatMessages = state.messages.get(chatId) ?? []

      let chats = state.chats
      if (fromOrganizer === 0 && lat != null && lng != null) {
        const chatToUpdate = chats.get(chatId)
        if (chatToUpdate !== undefined) {
          chatToUpdate.location = {
            lat,
            lng
          }
          chats = new Map(state.chats)
        }
      }

      const messages = new Map(state.messages)
      messages.set(chatId, [...chatMessages, action.payload])

      return {
        ...state,
        chats,
        messages
      }
    }
    }
  }

export const InboxContext = React.createContext<Inbox>(emptyInbox)

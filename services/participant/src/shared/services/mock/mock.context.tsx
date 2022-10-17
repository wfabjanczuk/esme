import React, { createContext } from 'react'

import announcements from './announcements.json'
import conversation from './conversation.json'
import events from './events.json'
import threads from './threads.json'

export interface Message {
  sent: number
  isOwn: boolean
  content: string
}

export interface Event {
  name: string
}

export interface Thread {
  updated: number
  type: 'conversation' | 'announcement'
  event: string
  unread: boolean
}

interface Mock {
  announcements: Message[]
  conversation: Message[]
  events: Event[]
  threads: Thread[]
}

const defaultMock: Mock = {
  announcements: [],
  conversation: [],
  events: [],
  threads: []
}

export const MockContext = createContext(defaultMock)

interface MockContextProps {
  children?: React.ReactNode
}

export const MockContextProvider = ({ children }: MockContextProps): JSX.Element => {
  const contextValue: Mock = {
    announcements,
    conversation,
    events,
    threads: threads as Thread[]
  }

  return (
    <MockContext.Provider value={contextValue}>{children}</MockContext.Provider>
  )
}

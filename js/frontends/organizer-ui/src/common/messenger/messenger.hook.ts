import { Reducer, useContext, useEffect, useReducer, useState } from 'react'
import { Messenger } from './messenger.context'
import { AuthenticatorContext } from '../authenticator/authenticator.context'
import { emptyInbox, Inbox, NewInboxReducer } from './inbox.context'
import { Action } from './structures'
import { AlertStoreContext } from '../alert-bar/alert-store.context'
import { ChatStarter } from './chat-starter.context'

const restartIntervalTime = 5000

export interface NewMessengerHook {
  messenger: Messenger
  inbox: Inbox
  chatStarter: ChatStarter
}

export const useNewMessenger = (): NewMessengerHook => {
  const alertStore = useContext(AlertStoreContext)
  const [messenger, setMessenger] = useState<Messenger>(new Messenger())
  const [isWaitingForNewChat, setIsWaitingForNewChat] = useState<boolean>(false)
  const [chatStarter, setChatStarter] = useState<ChatStarter>(new ChatStarter(isWaitingForNewChat, setIsWaitingForNewChat))

  const [inbox, dispatch] = useReducer<Reducer<Inbox, Action>>(NewInboxReducer(alertStore), emptyInbox)
  const { authorizationHeader } = useContext(AuthenticatorContext)

  useEffect(() => {
    setMessenger(new Messenger(setMessenger))
  }, [])

  useEffect(() => {
    if (messenger.hasState()) {
      messenger.initialize(authorizationHeader, dispatch, alertStore)
    }
  }, [messenger.hasState()])

  useEffect(() => {
    if (messenger.isInitialized()) {
      alertStore.add('success', 'WebSocket connection successfully initialized')
      messenger.getChats()
    }
  }, [messenger.isInitialized()])

  useEffect(() => {
    if (messenger.hasState() && !messenger.isInitialized()) {
      const restartInterval = setInterval(
        () => messenger.initialize(authorizationHeader, dispatch, alertStore),
        restartIntervalTime
      )
      return () => clearTimeout(restartInterval)
    }
  }, [messenger.hasState(), messenger.isInitialized()])

  useEffect(() => {
    inbox.chats.forEach((chat, chatId) => {
      const chatMessages = inbox.messages.get(chatId)
      if (chatMessages === undefined) {
        messenger.getChatHistory(chatId)
      }
    })
  }, [inbox.chats])

  useEffect(() => {
    setChatStarter(new ChatStarter(isWaitingForNewChat, setIsWaitingForNewChat))
  }, [isWaitingForNewChat])

  useEffect(() => {
    if (inbox.chatsCount > 0) {
      setIsWaitingForNewChat(false)
    }
  }, [inbox.chatsCount])

  useEffect(() => {
    if (inbox.callbacks.length > 0) {
      inbox.callbacks.forEach(cb => cb())
      inbox.callbacks = []
    }
  }, [inbox.callbacks])

  useEffect(() => {
    if (isWaitingForNewChat) {
      const restartInterval = setInterval(
        () => {
          messenger.startChat()
        },
        restartIntervalTime
      )
      return () => clearTimeout(restartInterval)
    }
  }, [messenger.hasState(), messenger.isInitialized(), isWaitingForNewChat])

  return {
    messenger,
    inbox,
    chatStarter
  }
}

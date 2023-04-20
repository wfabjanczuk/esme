import { Reducer, useContext, useEffect, useReducer, useState } from 'react'
import { Messenger } from './messenger.context'
import { AuthenticatorContext } from '../authenticator/authenticator.context'
import { emptyInbox, Inbox, InboxReducer } from './inbox.context'
import { Action } from './structures'
import { AlertStoreContext } from '../alert-bar/alert-store.context'

const restartIntervalTime = 5000

export interface NewMessengerHook {
  messenger: Messenger
  inbox: Inbox
}

export const useNewMessenger = (): NewMessengerHook => {
  const alertStore = useContext(AlertStoreContext)
  const [messenger, setMessenger] = useState<Messenger>(new Messenger())
  const [inbox, dispatch] = useReducer<Reducer<Inbox, Action>>(InboxReducer, emptyInbox)
  const { authorizationHeader } = useContext(AuthenticatorContext)

  useEffect(() => {
    setMessenger(new Messenger(setMessenger))
  }, [])

  useEffect(() => {
    if (messenger.hasState()) {
      messenger.initialize(authorizationHeader, dispatch)
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
        () => messenger.initialize(authorizationHeader, dispatch),
        restartIntervalTime
      )
      return () => clearTimeout(restartInterval)
    }
  }, [messenger.hasState(), messenger.isInitialized()])

  useEffect(() => {
    inbox.chats.forEach(chat => {
      if (inbox.messages[chat.id] === undefined) {
        messenger.getChatHistory(chat.id)
      }
    })
  }, [inbox.chats])

  return {
    messenger,
    inbox
  }
}

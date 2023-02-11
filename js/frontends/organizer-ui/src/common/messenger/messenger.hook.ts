import { Reducer, useContext, useEffect, useReducer } from 'react'
import { Messenger, MessengerContext } from './messenger.context'
import { AuthenticatorContext } from '../authenticator/authenticator.context'
import { emptyInbox, Inbox, InboxReducer } from './inbox.context'
import { Action } from './structures'

export interface NewMessengerHook {
  messenger: Messenger
  inbox: Inbox
}

export const useNewMessenger = (): NewMessengerHook => {
  const [inbox, dispatch] = useReducer<Reducer<Inbox, Action>>(InboxReducer, emptyInbox)
  const { authorizationHeader } = useContext(AuthenticatorContext)
  const messenger = useContext(MessengerContext)

  useEffect(() => {
    messenger.setDispatch(dispatch)
    messenger.connect(authorizationHeader)
  }, [])

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

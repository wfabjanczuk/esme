import { Archives } from './archives.context'
import { useContext, useEffect, useState } from 'react'
import { AlertStoreContext } from '../../../common/alert-bar/alert-store.context'
import { AuthenticatorContext } from '../../../common/authenticator/authenticator.context'

export interface NewArchivesHook {
  archives: Archives
}

export const useNewArchives = (): NewArchivesHook => {
  const alertStore = useContext(AlertStoreContext)
  const authenticator = useContext(AuthenticatorContext)
  const [archives, setArchives] = useState<Archives>(new Archives({}, {}, undefined, undefined))

  useEffect(() => {
    if (!archives.hasState()) {
      setArchives(new Archives({}, {}, authenticator, alertStore, setArchives))
    }
  }, [archives.hasState()])

  useEffect(() => {
    if (archives.hasState()) {
      Object.entries(archives.chats).forEach(([chatId]) => {
        if (archives.messages[chatId] === undefined) {
          archives.fetchChatMessages(chatId)
        }
      })
    }
  }, [authenticator, archives.chats])

  return { archives }
}

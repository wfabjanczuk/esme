import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../../common/authenticator/authenticator.context'
import { parseErrorMessage } from '../../../common/utils'
import { AlertStore, AlertStoreContext } from '../../../common/alert-bar/alert-store.context'
import axios from 'axios'
import { config } from '../../../app/config'
import { Message } from '../../../common/messenger/structures'

const chatsBaseUrl = `${config.messengerApiUrl}/chats`

export interface ChatMessagesListHook {
  errorMessages: string[]
  messages: Message[]
}

export const useChatMessagesList = (chatId: string): ChatMessagesListHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<ChatMessagesListHook>({
    messages: [],
    errorMessages: []
  })

  const url = `${chatsBaseUrl}/${chatId}/messages`
  useEffect(() => {
    if (chatId !== '') {
      void fetchAsync(url, setState, alertStore, authenticator)
    }
  }, [authenticator, chatId])

  return { ...state }
}

const fetchAsync = async (
  url: string,
  setState: Dispatch<SetStateAction<ChatMessagesListHook>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<Message[]>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      messages: data,
      errorMessages: []
    }))
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({
        messages: [],
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch chat messages')
    })
}

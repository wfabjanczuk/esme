import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../../common/authenticator/authenticator.context'
import { parseErrorMessage } from '../../../common/utils'
import { AlertStore, AlertStoreContext } from '../../../common/alert-bar/alert-store.context'
import axios from 'axios'
import { config } from '../../../app/config'
import { Chat } from '../../../common/messenger/structures'

const chatsUrl = `${config.messengerApiUrl}/chats`

export interface ChatsListHook {
  errorMessages: string[]
  chats: Chat[]
}

export const useChatsList = (): ChatsListHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<ChatsListHook>({
    chats: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetchAsync(setState, alertStore, authenticator)
  }, [authenticator])

  return { ...state }
}

const fetchAsync = async (
  setState: Dispatch<SetStateAction<ChatsListHook>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<Chat[]>(chatsUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      chats: data,
      errorMessages: []
    }))
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({
        chats: [],
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch chats')
    })
}

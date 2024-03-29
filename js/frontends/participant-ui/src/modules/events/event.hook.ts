import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { UserEvent } from './event.entity'
import axios from 'axios'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { config } from '../../app/config'
import { parseErrorData } from '../../common/utils'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import { useIsFocused } from '@react-navigation/native'

const eventsUrl = `${config.participantApiUrl}/events`
const chatRequestsUrl = `${config.participantApiUrl}/chat-requests`

interface RequestChatDto {
  eventId: number
  description: string
  lat?: number
  lng?: number
}

export interface EventHook {
  errorMessages: string[]
  event?: UserEvent
  requestChat: (data: RequestChatDto, onSuccess: () => void) => void
}

interface State {
  errorMessages: string[]
  event?: UserEvent
}

export const useEvent = (id: number): EventHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)
  const isFocused = useIsFocused()
  const url = `${eventsUrl}/${id}`

  const [state, setState] = useState<State>({
    errorMessages: [],
    event: undefined
  })

  useEffect(() => {
    if (isFocused) {
      void fetchAsync(url, setState, alertStore, authenticator)
    }
  }, [authenticator, isFocused])

  const requestChat = (data: RequestChatDto, onSuccess: () => void): void => {
    const onSuccessWrapped = (): void => {
      void fetchAsync(url, setState, alertStore, authenticator)
      onSuccess()
    }
    void requestChatAsync(data, onSuccessWrapped, url, setState, alertStore, authenticator)
  }

  return {
    ...state,
    requestChat
  }
}

const fetchAsync = async (
  url: string,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<UserEvent>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      event: data,
      errorMessages: []
    }))
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        event: undefined,
        errorMessages: parseErrorData(e?.response?.data)
      })
      alertStore.add('error', 'Could not fetch event')
    })
}

const requestChatAsync = async (
  data: RequestChatDto,
  onSuccess: () => void,
  url: string,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.post(chatRequestsUrl, data, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      alertStore.add('success', 'Request for help sent')
      onSuccess()
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState(prevState => ({
        ...prevState,
        errorMessages: parseErrorData(e?.response?.data)
      }))
      alertStore.add('error', 'Could not request help')
    })
}

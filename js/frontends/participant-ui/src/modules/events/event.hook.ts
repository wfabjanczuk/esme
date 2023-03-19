import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { UserEvent } from './event.entity'
import axios from 'axios'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { config } from '../../app/config'
import { parseErrorData } from '../../common/utils'

const eventsUrl = `${config.participantApiUrl}/events`
const chatRequestsUrl = `${config.participantApiUrl}/chat-requests`

export interface EventHook {
  errorMessages: string[]
  event?: UserEvent
  requestChat: () => void
  subscribe: () => void
  unsubscribe: () => void
}

interface State {
  errorMessages: string[]
  event?: UserEvent
}

export const useEvent = (id: number): EventHook => {
  const authenticator = useContext(AuthenticatorContext)
  const url = `${eventsUrl}/${id}`

  const [state, setState] = useState<State>({
    errorMessages: [],
    event: undefined
  })

  useEffect(() => {
    void fetchAsync(url, authenticator, setState)
  }, [authenticator])

  const requestChat = (): void => {
    void requestChatAsync(url, authenticator, setState)
  }

  const subscribe = (): void => {
    void subscribeAsync(url, authenticator, setState)
  }

  const unsubscribe = (): void => {
    void unsubscribeAsync(url, authenticator, setState)
  }

  return {
    ...state,
    requestChat,
    subscribe,
    unsubscribe
  }
}

const fetchAsync = async (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
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
    })
}

const requestChatAsync = async (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  return await axios.post(chatRequestsUrl, {}, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      console.log('successfully send chat request to', chatRequestsUrl)
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState(prevState => ({
        ...prevState,
        errorMessages: parseErrorData(e?.response?.data)
      }))
    })
}

const subscribeAsync = async (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  const subscribeUrl = `${url}/subscribes`
  return await axios.post(subscribeUrl, {}, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      console.log('successfully subscribed on', subscribeUrl)
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState(prevState => ({
        ...prevState,
        errorMessages: parseErrorData(e?.response?.data)
      }))
    })
}

const unsubscribeAsync = async (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  const unsubscribeUrl = `${url}/unsubscribes`
  return await axios.post(unsubscribeUrl, {}, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      console.log('successfully unsubscribed from', unsubscribeUrl)
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState(prevState => ({
        ...prevState,
        errorMessages: parseErrorData(e?.response?.data)
      }))
    })
}

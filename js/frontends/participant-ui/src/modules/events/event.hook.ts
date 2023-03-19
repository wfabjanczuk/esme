import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { UserEvent } from './event.entity'
import axios from 'axios'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { config } from '../../app/config'
import { parseErrorData } from '../../common/utils'

const eventsUrl = `${config.participantApiUrl}/events`
const chatRequestsUrl = `${config.participantApiUrl}/chat-requests`

interface RequestChatDto {
  eventId: number
  description: string
  lat: number
  lng: number
}

export interface EventHook {
  errorMessages: string[]
  event?: UserEvent
  requestChat: (data: RequestChatDto) => void
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

  const requestChat = (data: RequestChatDto): void => {
    void requestChatAsync(data, url, authenticator, setState)
  }

  return {
    ...state,
    requestChat
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
  data: RequestChatDto,
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  return await axios.post(chatRequestsUrl, data, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      console.log('successfully sent chat request to', chatRequestsUrl)
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

import { config } from '../../app/config'
import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import { Event as EsmeEvent } from './event'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

const eventsUrl = `${config.organizerApiUrl}/agency/events`

export interface EventHook {
  event?: EsmeEvent
  errorMessages: string[]
}

interface EventState {
  event?: EsmeEvent
  errorMessages: string[]
}

export const useEvent = (id: number): EventHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [eventState, setEventState] = useState<EventState>({
    event: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchEvent(id, authenticator, setEventState)
  }, [authenticator])

  return {
    event: eventState.event,
    errorMessages: eventState.errorMessages
  }
}

const fetchEvent = async (
  id: number,
  authenticator: Authenticator,
  setState: (state: EventState) => void
): Promise<void> => {
  const eventUrl = `${eventsUrl}/${id}`
  return await axios.get<EsmeEvent>(eventUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      event: data,
      errorMessages: []
    }))
    .catch(e => {
      authenticator.checkAuthError(e)
      setState({
        event: undefined,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

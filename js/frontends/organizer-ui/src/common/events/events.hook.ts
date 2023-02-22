import { config } from '../../app/config'
import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import { Event as EsmeEvent } from './event'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

const eventsUrl = `${config.organizerApiUrl}/agency/events`

export interface EventsHook {
  events: EsmeEvent[]
  errorMessages: string[]
}

interface EventsState {
  events: EsmeEvent[]
  errorMessages: string[]
}

export const useEvents = (): EventsHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [eventsState, setEventsState] = useState<EventsState>({
    events: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetchEvents(authenticator, setEventsState)
  }, [authenticator])

  return {
    events: eventsState.events,
    errorMessages: eventsState.errorMessages
  }
}

const fetchEvents = async (
  authenticator: Authenticator,
  setState: (state: EventsState) => void
): Promise<void> => {
  return await axios.get<EsmeEvent[]>(eventsUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      events: data,
      errorMessages: []
    }))
    .catch(e => {
      authenticator.isAuthError(e)
      setState({
        events: [],
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

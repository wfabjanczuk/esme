import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { Event } from './event.entity'
import axios from 'axios'
import { config } from '../../app/config'
import { parseErrorData } from '../../common/utils'

const eventsUrl = `${config.participantApiUrl}/events`

export interface EventsListHook {
  errorMessages: string[]
  events: Event[]
  setQuery: (query: string) => void
}

interface State {
  errorMessages: string[]
  events: Event[]
  query: string
}

export const useEventsList = (): EventsListHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    query: '',
    events: [],
    errorMessages: []
  })

  const setQuery = (query: string): void => {
    setState({
      ...state,
      query
    })
  }

  useEffect(() => {
    // TODO: debounce
    void fetchAsync(state.query, setState, authenticator)
  }, [authenticator, state.query])

  return {
    events: state.events,
    errorMessages: state.errorMessages,
    setQuery
  }
}

const fetchAsync = async (
  query: string,
  setState: Dispatch<SetStateAction<State>>,
  authenticator: Authenticator
): Promise<void> => {
  const url = query.length > 0
    ? `${eventsUrl}?query=${query}`
    : eventsUrl

  return await axios.get<Event[]>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState(prevState => ({
        ...prevState,
        events: data,
        errorMessages: []
      }))
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState(prevState => ({
        ...prevState,
        events: [],
        errorMessages: parseErrorData(e?.response?.data)
      }))
    })
}

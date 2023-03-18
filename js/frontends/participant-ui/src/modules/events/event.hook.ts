import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Event } from './event.entity'
import axios from 'axios'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { config } from '../../app/config'
import { parseErrorMessage } from '../../common/utils'

const eventsUrl = `${config.participantApiUrl}/events`

export interface EventHook {
  errorMessages: string[]
  event?: Event
}

interface State {
  errorMessages: string[]
  event?: Event
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

  return {
    ...state
  }
}

const fetchAsync = async (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  return await axios.get<Event>(url, { headers: { Authorization: authenticator.authorizationHeader } })
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
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

import { config } from '../../app/config'
import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'
import { Participant } from './participant'
import { AlertStore, AlertStoreContext } from '../alert-bar/alert-store.context'

const participantsUrl = `${config.organizerApiUrl}/participants`

export interface ParticipantHook {
  participant?: Participant
  errorMessages: string[]
}

interface ParticipantState {
  participant?: Participant
  errorMessages: string[]
}

export const useParticipantDetails = (id: number): ParticipantHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [participantState, setParticipantState] = useState<ParticipantState>({
    participant: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchParticipant(id, authenticator, setParticipantState, alertStore)
  }, [authenticator])

  return {
    participant: participantState.participant,
    errorMessages: participantState.errorMessages
  }
}

const fetchParticipant = async (
  id: number,
  authenticator: Authenticator,
  setState: (state: ParticipantState) => void,
  alertStore: AlertStore
): Promise<void> => {
  const participantUrl = `${participantsUrl}/${id}`
  return await axios.get<Participant>(participantUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      participant: data,
      errorMessages: []
    }))
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({
        participant: undefined,
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch participant')
    })
}

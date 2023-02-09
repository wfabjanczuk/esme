import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import axios from 'axios'
import { config } from '../../app/config'
import { Agency } from './agency'
import { parseErrorMessage } from '../../common/utils'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'

const agencyUrl = `${config.apiUrl}/agency`

export interface AgencyHook {
  agency?: Agency
  updateAgency: (payload: UpdateAgencyPayload) => Promise<void>
  deleteAgency: () => Promise<void>
  errorMessages: string[]
}

interface AgencyState {
  agency?: Agency
  errorMessages: string[]
}

export const useAgency = (): AgencyHook => {
  const authenticator = useContext(AuthenticatorContext)

  const alertStore = useContext(AlertStoreContext)
  const [agencyState, setAgencyState] = useState<AgencyState>({
    agency: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchAgency(authenticator, setAgencyState)
  }, [authenticator])

  return {
    agency: agencyState.agency,
    updateAgency: async (payload) => await updateAgency(payload, authenticator, setAgencyState, alertStore),
    deleteAgency: async () => await deleteAgency(authenticator, setAgencyState),
    errorMessages: agencyState.errorMessages
  }
}

const fetchAgency = async (
  authenticator: Authenticator,
  setState: (state: AgencyState) => void
): Promise<void> => {
  return await axios.get<Agency>(agencyUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => {
      authenticator.checkAuthError(e)
      setState({
        agency: undefined,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

export interface UpdateAgencyPayload {
  name?: string
  address?: string
  website?: string
}

const updateAgency = async (
  payload: UpdateAgencyPayload,
  authenticator: Authenticator,
  setAgencyState: Dispatch<SetStateAction<AgencyState>>,
  alertStore: AlertStore
): Promise<void> => {
  return await axios.patch<Agency>(agencyUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      alertStore.add('success', 'Agency successfully updated')
      setAgencyState({
        agency: data,
        errorMessages: []
      })
    })
    .catch(e => {
      authenticator.checkAuthError(e)
      setAgencyState((prevState) => ({
        agency: prevState.agency,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
    })
}

const deleteAgency = async (
  authenticator: Authenticator,
  setAgencyState: Dispatch<SetStateAction<AgencyState>>
): Promise<void> => {
  return await axios.delete<Agency>(agencyUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setAgencyState({
        agency: undefined,
        errorMessages: []
      })
      void authenticator.signOut()
    })
    .catch(e => setAgencyState((prevState) => ({
      agency: prevState.agency,
      errorMessages: parseErrorMessage(e?.response?.data?.message)
    })))
}

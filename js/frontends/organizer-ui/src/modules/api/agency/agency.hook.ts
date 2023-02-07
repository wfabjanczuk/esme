import { useContext, useEffect, useState } from 'react'
import { AuthenticatorContext } from '../auth/authenticator.context'
import axios from 'axios'
import { config } from '../../config/config'
import { Agency } from './agency'
import { parseErrorMessage } from '../common/utils'

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
  const { authorizationHeader } = useContext(AuthenticatorContext)
  const [state, setState] = useState<AgencyState>({
    agency: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchAgency(authorizationHeader, setState)
  }, [authorizationHeader])

  return {
    agency: state.agency,
    updateAgency: async (payload) => await updateAgency(payload, authorizationHeader, setState),
    deleteAgency: async () => await deleteAgency(authorizationHeader, setState),
    errorMessages: state.errorMessages
  }
}

const fetchAgency = async (
  Authorization: string,
  setState: (state: AgencyState) => void
): Promise<void> => {
  return await axios.get<Agency>(agencyUrl, { headers: { Authorization } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => setState({
      agency: undefined,
      errorMessages: parseErrorMessage(e?.response?.data?.message)
    }))
}

export interface UpdateAgencyPayload {
  name?: string
  address?: string
  website?: string
}

const updateAgency = async (
  payload: UpdateAgencyPayload,
  Authorization: string,
  setState: (state: AgencyState) => void
): Promise<void> => {
  return await axios.patch<Agency>(agencyUrl, payload, { headers: { Authorization } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => setState({
      agency: undefined,
      errorMessages: parseErrorMessage(e?.response?.data?.message)
    }))
}

const deleteAgency = async (
  Authorization: string,
  setState: (state: AgencyState) => void
): Promise<void> => {
  return await axios.delete<Agency>(agencyUrl, { headers: { Authorization } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => setState({
      agency: undefined,
      errorMessages: parseErrorMessage(e?.response?.data?.message)
    }))
}

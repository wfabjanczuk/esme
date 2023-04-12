import { ListHook, useList } from '../../../common/hooks/list.hook'
import { Agency } from '../../agency/agency.entity'
import { config } from '../../../app/config'
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../../common/authenticator/authenticator.context'
import { AlertStore, AlertStoreContext } from '../../../common/alert-bar/alert-store.context'
import { parseErrorMessage } from '../../../common/utils'
import axios from 'axios'

const agenciesApiUrl = `${config.organizerApiUrl}/agencies`

export const useAgenciesList = (): ListHook<Agency> =>
  useList<Agency>(agenciesApiUrl)

interface VerifyAgencyHook {
  errorMessages: string[]
  agency?: Agency
  verify: (e: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
  agency?: Agency
}

export const useAdminAgency = (id: number): VerifyAgencyHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)
  const url = `${agenciesApiUrl}/${id}`

  const [state, setState] = useState<State>({
    agency: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchAgency(url, setState, alertStore, authenticator)
  }, [authenticator])

  const verify = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const approved = formData.get('approved') === 'true'
    void verifyAsync(url, { approved }, setState, alertStore, authenticator)
  }

  return {
    ...state,
    verify
  }
}

const fetchAgency = async (
  url: string,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<Agency>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({
        agency: undefined,
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch agency')
    })
}

const verifyAsync = async (
  url: string,
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  const verifyUrl = `${url}/verify`
  return await axios.patch<Agency>(verifyUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        agency: data,
        errorMessages: []
      })
      alertStore.add('success', 'Agency updated successfully')
    })
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState((prevState) => ({
        agency: prevState.agency,
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not update agency')
    })
}

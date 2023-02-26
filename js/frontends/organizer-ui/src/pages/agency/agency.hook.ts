import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import axios from 'axios'
import { config } from '../../app/config'
import { Agency } from './agency.entity'
import { parseErrorMessage } from '../../common/utils'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'

const agencyUrl = `${config.organizerApiUrl}/agency`

interface AgencyHook {
  errorMessages: string[]
  agency?: Agency
  update: (e: FormEvent<HTMLFormElement>) => void
  remove: () => void
}

interface State {
  errorMessages: string[]
  agency?: Agency
}

export const useAgency = (): AgencyHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<State>({
    agency: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchAgency(setState, alertStore, authenticator)
  }, [authenticator])

  const update = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void updateAsync(payload, setState, alertStore, authenticator)
  }

  const remove = (): void => {
    void removeAsync(setState, alertStore, authenticator)
  }

  return {
    errorMessages: state.errorMessages,
    agency: state.agency,
    update,
    remove
  }
}

const fetchAgency = async (
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<Agency>(agencyUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      agency: data,
      errorMessages: []
    }))
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        agency: undefined,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch agency')
    })
}

const updateAsync = async (
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.patch<Agency>(agencyUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        agency: data,
        errorMessages: []
      })
      alertStore.add('success', 'Agency updated successfully')
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        agency: prevState.agency,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not update agency')
    })
}

const removeAsync = async (
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.delete<Agency>(agencyUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({
        agency: undefined,
        errorMessages: []
      })
      void authenticator.signOut()
    })
    .catch(e => {
      setState((prevState) => ({
        agency: prevState.agency,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not remove agency')
    })
}

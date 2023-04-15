import { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import { parseErrorMessage } from '../utils'
import { AlertStore, AlertStoreContext } from '../alert-bar/alert-store.context'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export interface CreateHook {
  errorMessages: string[]
  create: (payload: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
}

export const useCreate = (baseUrl: string, onCreateRedirectUrl: string): CreateHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)
  const navigate = useNavigate()

  const onCreate = (): void => navigate(onCreateRedirectUrl)
  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const create = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void createAsync(baseUrl, payload, onCreate, setState, alertStore, authenticator)
  }

  return { ...state, create }
}

const createAsync = async (
  url: string,
  payload: Object,
  onCreate: () => void,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.post(url, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({ errorMessages: [] })
      alertStore.add('success', 'Entity created successfully')
      onCreate()
    })
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({ errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message) })
      alertStore.add('error', 'Could not create entity')
    })
}

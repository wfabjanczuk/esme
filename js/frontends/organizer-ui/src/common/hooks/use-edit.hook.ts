import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'
import { Agency } from '../../pages/agency/agency'
import { useNavigate } from 'react-router-dom'
import { AlertStore, AlertStoreContext } from '../alert-bar/alert-store.context'

export interface EditHook<T> {
  errorMessages: string[]
  entity?: T
  update: (e: FormEvent<HTMLFormElement>) => void
  remove: () => void
}

interface State<T> {
  errorMessages: string[]
  entity?: T
}

export const useEdit = <T> (id: number, baseUrl: string, onDeleteRedirectUrl: string): EditHook<T> => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)
  const navigate = useNavigate()

  const url = `${baseUrl}/${id}`
  const onDelete = (): void => navigate(onDeleteRedirectUrl)

  const [state, setState] = useState<State<T>>({
    errorMessages: [],
    entity: undefined
  })

  useEffect(() => {
    void fetchAsync(url, authenticator, setState, alertStore)
  }, [authenticator])

  const update = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void updateAsync(url, payload, authenticator, setState, alertStore)
  }

  const remove = (): void => {
    void removeAsync(url, onDelete, authenticator, setState, alertStore)
  }

  return { ...state, update, remove }
}

const fetchAsync = async <T> (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>,
  alertStore: AlertStore
): Promise<void> => {
  return await axios.get<T>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      entity: data,
      errorMessages: []
    }))
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        entity: undefined,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch entity')
    })
}

const updateAsync = async <T> (
  url: string,
  payload: Object,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>,
  alertStore: AlertStore
): Promise<void> => {
  return await axios.patch<T>(url, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        entity: data,
        errorMessages: []
      })
      alertStore.add('success', 'Entity updated successfully')
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        entity: prevState.entity,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not update entity')
    })
}

const removeAsync = async <T> (
  url: string,
  onDelete: () => void,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>,
  alertStore: AlertStore
): Promise<void> => {
  return await axios.delete<Agency>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({
        entity: undefined,
        errorMessages: []
      })
      alertStore.add('success', 'Entity removed successfully')
      onDelete()
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        entity: prevState.entity,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not remove entity')
    })
}

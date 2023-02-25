import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'
import { AlertStore, AlertStoreContext } from '../alert-bar/alert-store.context'

export interface ListHook<T> {
  errorMessages: string[]
  list: T[]
}

interface State<T> {
  errorMessages: string[]
  list: T[]
}

export const useList = <T> (baseUrl: string): ListHook<T> => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<State<T>>({
    list: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetch(baseUrl, setState, alertStore, authenticator)
  }, [authenticator])

  return { ...state }
}

const fetch = async <T> (
  url: string,
  setState: (state: State<T>) => void,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<T[]>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      list: data,
      errorMessages: []
    }))
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        list: [],
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch entities')
    })
}

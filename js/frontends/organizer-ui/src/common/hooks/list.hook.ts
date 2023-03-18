import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import { parseErrorMessage } from '../utils'
import { AlertStore, AlertStoreContext } from '../alert-bar/alert-store.context'
import axios from 'axios'

export interface ListHook<T> {
  errorMessages: string[]
  list: T[]
}

export const useList = <T> (baseUrl: string): ListHook<T> => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<ListHook<T>>({
    list: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetchAsync(baseUrl, setState, alertStore, authenticator)
  }, [authenticator])

  return { ...state }
}

const fetchAsync = async <T> (
  url: string,
  setState: Dispatch<SetStateAction<ListHook<T>>>,
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

import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

export interface ListHook<T> {
  list: T[]
  errorMessages: string[]
}

interface State<T> {
  list: T[]
  errorMessages: string[]
}

export const useList = <T> (baseUrl: string): ListHook<T> => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State<T>>({
    list: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetch(baseUrl, authenticator, setState)
  }, [authenticator])

  return {
    list: state.list,
    errorMessages: state.errorMessages
  }
}

const fetch = async <T> (
  url: string,
  authenticator: Authenticator,
  setState: (state: State<T>) => void
): Promise<void> => {
  return await axios.get<T[]>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      list: data,
      errorMessages: []
    }))
    .catch(e => {
      authenticator.isAuthError(e)
      setState({
        list: [],
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

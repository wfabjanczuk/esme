import { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

export interface CreateHook {
  errorMessages: string[]
  create: (payload: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
}

export const useCreate = (baseUrl: string): CreateHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const create = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void createAsync(baseUrl, payload, authenticator, setState)
  }

  return { ...state, create }
}

const createAsync = async <T> (
  url: string,
  payload: Object,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  return await axios.post<T>(url, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        errorMessages: []
      })
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

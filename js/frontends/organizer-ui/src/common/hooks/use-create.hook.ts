import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

export interface CreateHook {
  errorMessages: string[]
  create: (payload: Object) => Promise<void>
}

interface State {
  errorMessages: string[]
}

export const useCreate = (baseUrl: string): CreateHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    errorMessages: []
  })

  return {
    errorMessages: state.errorMessages,
    create: async (payload: Object) => await create(baseUrl, payload, authenticator, setState)
  }
}

const create = async <T> (
  url: string,
  payload: Object,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  return await axios.patch<T>(url, payload, { headers: { Authorization: authenticator.authorizationHeader } })
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

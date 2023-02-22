import { useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'

export interface ListHook<T> {
  collection: T[]
  errorMessages: string[]
}

interface State<T> {
  collection: T[]
  errorMessages: string[]
}

export const useList = <T> (baseUrl: string): ListHook<T> => {
  const authenticator = useContext(AuthenticatorContext)

  const [collectionState, setCollectionState] = useState<State<T>>({
    collection: [],
    errorMessages: []
  })

  useEffect(() => {
    void fetch(baseUrl, authenticator, setCollectionState)
  }, [authenticator])

  return {
    collection: collectionState.collection,
    errorMessages: collectionState.errorMessages
  }
}

const fetch = async <T> (
  url: string,
  authenticator: Authenticator,
  setState: (state: State<T>) => void
): Promise<void> => {
  return await axios.get<T[]>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      collection: data,
      errorMessages: []
    }))
    .catch(e => {
      authenticator.isAuthError(e)
      setState({
        collection: [],
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
    })
}

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../utils'
import { Agency } from '../../pages/agency/agency'
import { useNavigate } from 'react-router-dom'

export interface EditHook<T> {
  entity?: T
  update: (payload: Object) => Promise<void>
  remove: () => Promise<void>
  errorMessages: string[]
}

interface State<T> {
  entity?: T
  errorMessages: string[]
}

export const useEdit = <T> (id: number, baseUrl: string, onDeleteRedirectUrl: string): EditHook<T> => {
  const authenticator = useContext(AuthenticatorContext)
  const navigate = useNavigate()
  const onDelete = (): void => navigate(onDeleteRedirectUrl)

  const [state, setState] = useState<State<T>>({
    entity: undefined,
    errorMessages: []
  })

  const url = `${baseUrl}/${id}`
  useEffect(() => {
    void fetch(url, authenticator, setState)
  }, [authenticator])

  return {
    errorMessages: state.errorMessages,
    entity: state.entity,
    update: async (payload: Object) => await update(url, payload, authenticator, setState),
    remove: async () => await remove(url, onDelete, authenticator, setState)
  }
}

const fetch = async <T> (
  url: string,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>
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
    })
}

const update = async <T> (
  url: string,
  payload: Object,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>
): Promise<void> => {
  return await axios.patch<T>(url, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        entity: data,
        errorMessages: []
      })
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        entity: prevState.entity,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
    })
}

const remove = async <T> (
  url: string,
  onDelete: () => void,
  authenticator: Authenticator,
  setState: Dispatch<SetStateAction<State<T>>>
): Promise<void> => {
  return await axios.delete<Agency>(url, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({
        entity: undefined,
        errorMessages: []
      })
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
    })
}

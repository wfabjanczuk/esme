import { config } from '../../app/config'
import { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import axios from 'axios'
import { parseErrorMessage } from '../../common/utils'

const changePasswordUrl = `${config.organizerApiUrl}/profile/change-password`

interface ChangePasswordHook {
  errorMessages: string[]
  changePassword: (e: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
}

export const useChangePassword = (): ChangePasswordHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const changePassword = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void changePasswordAsync(payload, setState, alertStore, authenticator)
  }

  return {
    ...state,
    changePassword
  }
}

const changePasswordAsync = async (
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.patch(changePasswordUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({
        errorMessages: []
      })
      window.location.replace('/')
    })
    .catch(e => {
      const authErrors = authenticator.parseAuthError(e)
      setState({
        errorMessages: authErrors.length > 0 ? authErrors : parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not update profile')
    })
}

import { config } from '../../app/config'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../../common/utils'

const changePasswordUrl = `${config.participantApiUrl}/profile/change-password`

type ChangePasswordValues = Record<'oldPassword' | 'newPassword' | 'confirmNewPassword', string>

interface ChangePasswordHook {
  errorMessages: string[]
  changePassword: (formValues: ChangePasswordValues) => void
}

interface State {
  errorMessages: string[]
}

export const useChangePassword = (): ChangePasswordHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const changePassword = (formValues: ChangePasswordValues): void => {
    void changePasswordAsync(formValues, setState, authenticator)
  }

  return {
    ...state,
    changePassword
  }
}

const changePasswordAsync = async (
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.patch(changePasswordUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(() => {
      setState({
        errorMessages: []
      })
      void authenticator.signOut()
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

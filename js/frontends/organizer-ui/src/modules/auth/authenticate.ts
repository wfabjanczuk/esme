import { CurrentUser, Profile } from './current-user-context'
import { config } from '../config/config'
import { FormEvent } from 'react'
import axios from 'axios'
import { parseErrorMessage } from './form-errors.component'

interface SignInResponse {
  data: {
    user: Profile
    token: string
  }
}

const signInUrl = `${config.apiUrl}/auth/sign-in`

export const authenticate = (
  e: FormEvent<HTMLFormElement>,
  currentUser: CurrentUser,
  setErrorMessages: (errors: string[]) => void
): void => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const payload = Object.fromEntries(formData)

  void axios.post(signInUrl, payload)
    .then(({ data }: SignInResponse) => {
      currentUser.update(data.user, `Bearer ${data.token}`)
    })
    .catch(e => {
      const errorMessages: string[] = parseErrorMessage(e?.response?.data?.message)
      setErrorMessages(errorMessages.length > 0 ? errorMessages : ['service unavailable'])
    })
}

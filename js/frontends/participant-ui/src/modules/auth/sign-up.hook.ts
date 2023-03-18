import { Dispatch, SetStateAction, useState } from 'react'
import { config } from '../../app/config'
import axios from 'axios'
import { parseErrorData } from '../../common/utils'

const signUpUrl = `${config.participantApiUrl}/auth/sign-up`

type SignUpValues = Record<'email' | 'phoneNumber' | 'password' | 'confirmPassword', string>

interface SignUpHook {
  errorMessages: string[]
  signUp: (values: SignUpValues) => void
}

interface State {
  errorMessages: string[]
}

export const useSignUp = (): SignUpHook => {
  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const signUp = (formValues: SignUpValues): void => {
    void signUpAsync(formValues, setState)
  }

  return {
    ...state,
    signUp
  }
}

const signUpAsync = async (
  formValues: SignUpValues,
  setState: Dispatch<SetStateAction<State>>
): Promise<void> => {
  await axios.post(signUpUrl, formValues)
    .then(() => setState({ errorMessages: [] }))
    .catch(e => setState({ errorMessages: parseErrorData(e?.response?.data) }))
}

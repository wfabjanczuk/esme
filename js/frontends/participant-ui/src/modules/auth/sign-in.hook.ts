import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { Dispatch, SetStateAction, useContext, useState } from 'react'

type SignInValues = Record<'email' | 'password', string>

interface SignInHook {
  errorMessages: string[]
  signIn: (values: SignInValues) => void
}

interface State {
  errorMessages: string[]
}

export const useSignIn = (): SignInHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const signIn = (formValues: SignInValues): void => {
    void signInAsync(formValues.email, formValues.password, setState, authenticator)
  }

  return {
    ...state,
    signIn
  }
}

const signInAsync = async (
  email: string,
  password: string,
  setState: Dispatch<SetStateAction<State>>,
  authenticator: Authenticator
): Promise<void> => {
  const errorMessages = await authenticator.signIn(email, password)
  setState({ errorMessages })
}

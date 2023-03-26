import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { config } from '../../app/config'
import axios from 'axios'
import { parseErrorData } from '../../common/utils'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'

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
  const alertStore = useContext(AlertStoreContext)
  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const signUp = (formValues: SignUpValues): void => {
    void signUpAsync(formValues, setState, alertStore)
  }

  return {
    ...state,
    signUp
  }
}

const signUpAsync = async (
  formValues: SignUpValues,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore
): Promise<void> => {
  await axios.post(signUpUrl, formValues)
    .then(() => {
      alertStore.add('success', 'Participant created successfully')
      setState({ errorMessages: [] })
    })
    .catch(e => {
      alertStore.add('error', 'Could not register participant')
      setState({ errorMessages: parseErrorData(e?.response?.data) })
    })
}

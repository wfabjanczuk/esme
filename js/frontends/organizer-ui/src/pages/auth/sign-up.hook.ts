import { Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import { Agency } from '../agency/agency.entity'
import { parseErrorMessage } from '../../common/utils'
import { config } from '../../app/config'
import axios from 'axios'

const signUpUrl = `${config.organizerApiUrl}/agency`

interface SignUpHook {
  errorMessages: string[]
  signUp: (e: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
}

export const useSignUp = (): SignUpHook => {
  const alertStore = useContext(AlertStoreContext)
  const navigate = useNavigate()

  const onSignUp = (): void => navigate('/')
  const [state, setState] = useState<State>({
    errorMessages: []
  })

  const signUp = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      owner: recordFromFields(formData,
        ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phoneNumber']
      ),
      agency: recordFromFields(formData,
        ['name', 'address', 'website']
      )
    }
    void signUpAsync(payload, onSignUp, setState, alertStore)
  }

  return {
    ...state,
    signUp
  }
}

const signUpAsync = async (
  payload: Object,
  onSignUp: () => void,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore
): Promise<void> => {
  await axios.post<Agency>(signUpUrl, payload)
    .then(() => {
      alertStore.add('success', 'Agency successfully created')
      onSignUp()
    })
    .catch(e => {
      setState({ errorMessages: parseErrorMessage(e?.response?.data?.message) })
      alertStore.add('error', 'Could not register agency')
    })
}

const recordFromFields = (formData: FormData, fields: string[]): Record<string, string> => {
  return fields.reduce<Record<string, string>>((o, f) => {
    o[f] = formData.get(f) as string
    return o
  }, {})
}

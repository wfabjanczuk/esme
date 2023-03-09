import { config } from '../../app/config'
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { AlertStore, AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import axios from 'axios'
import { parseErrorMessage } from '../../common/utils'
import { Profile } from './profile.entity'

const profileUrl = `${config.organizerApiUrl}/profile`

interface EditProfileHook {
  errorMessages: string[]
  profile?: Profile
  update: (e: FormEvent<HTMLFormElement>) => void
}

interface State {
  errorMessages: string[]
  profile?: Profile
}

export const useEditProfile = (): EditProfileHook => {
  const authenticator = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  const [state, setState] = useState<State>({
    profile: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchProfile(setState, alertStore, authenticator)
  }, [authenticator])

  const update = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData)
    void updateAsync(payload, setState, alertStore, authenticator)
  }

  return {
    ...state,
    update
  }
}

const fetchProfile = async (
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.get<Profile>(profileUrl, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => setState({
      profile: data,
      errorMessages: []
    }))
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState({
        profile: undefined,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      })
      alertStore.add('error', 'Could not fetch profile')
    })
}

const updateAsync = async (
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  alertStore: AlertStore,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.patch<Profile>(profileUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        profile: data,
        errorMessages: []
      })
      alertStore.add('success', 'Profile updated successfully')
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        profile: prevState.profile,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
      alertStore.add('error', 'Could not update profile')
    })
}

export const useProfileDetails = (): Pick<EditProfileHook, 'errorMessages' | 'profile'> =>
  useEditProfile()

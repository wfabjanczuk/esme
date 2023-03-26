import { config } from '../../app/config'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import axios from 'axios'
import { parseErrorMessage } from '../../common/utils'
import { Profile } from './profile.entity'

const profileUrl = `${config.participantApiUrl}/profile`

type ProfileValues = Record<'phoneNumber', string>

interface EditProfileHook {
  errorMessages: string[]
  profile?: Profile
  update: (formValues: ProfileValues) => void
}

interface State {
  errorMessages: string[]
  profile?: Profile
}

export const useEditProfile = (): EditProfileHook => {
  const authenticator = useContext(AuthenticatorContext)

  const [state, setState] = useState<State>({
    profile: undefined,
    errorMessages: []
  })

  useEffect(() => {
    void fetchProfile(setState, authenticator)
  }, [authenticator])

  const update = (formValues: ProfileValues): void => {
    void updateAsync(formValues, setState, authenticator)
  }

  return {
    ...state,
    update
  }
}

const fetchProfile = async (
  setState: Dispatch<SetStateAction<State>>,
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
    })
}

const updateAsync = async (
  payload: Object,
  setState: Dispatch<SetStateAction<State>>,
  authenticator: Authenticator
): Promise<void> => {
  return await axios.patch<Profile>(profileUrl, payload, { headers: { Authorization: authenticator.authorizationHeader } })
    .then(({ data }) => {
      setState({
        profile: data,
        errorMessages: []
      })
    })
    .catch(e => {
      if (authenticator.isAuthError(e)) {
        return
      }
      setState((prevState) => ({
        profile: prevState.profile,
        errorMessages: parseErrorMessage(e?.response?.data?.message)
      }))
    })
}

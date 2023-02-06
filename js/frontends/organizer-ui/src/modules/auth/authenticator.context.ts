import React from 'react'
import axios from 'axios'
import { config } from '../config/config'
import { Profile } from './profile'

const signInUrl = `${config.apiUrl}/auth/sign-in`

interface SignInResponse {
  data: {
    user: Profile
    token: string
  }
}

export class Authenticator {
  constructor (
    private readonly setState?: (currentUser: Authenticator) => void,
    public readonly profile?: Profile,
    public readonly authorizationHeader?: string
  ) {
  }

  isAuthorized (): boolean {
    return this.profile !== undefined
  }

  async signInPassword (email: string, password: string): Promise<string[]> {
    return await axios.post(signInUrl, { email, password })
      .then(({ data }: SignInResponse) => {
        this.update(data.user, `Bearer ${data.token}`)
        return [] as string[]
      })
      .catch(e => {
        this.update(undefined, undefined)
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  private update (profile?: Profile, authorizationHeader?: string): void {
    if (this.setState === undefined) {
      throw new Error('Authenticator.setState is undefined')
    }
    this.setState(new Authenticator(this.setState, profile, authorizationHeader))
  }
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

export const parseErrorMessage = (message: string[] | string | undefined): string[] => {
  if (message === undefined) {
    return []
  }

  if (typeof message === 'string') {
    return [message]
  }

  return message
}

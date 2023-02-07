import React from 'react'
import axios from 'axios'
import { config } from '../../config/config'
import { Profile } from './profile'
import { parseErrorMessage } from '../common/utils'

const signInUrl = `${config.apiUrl}/auth/sign-in`
const emptySetState = (): void => {}

interface SignInResponse {
  user: Profile
  token: string
}

export class Authenticator {
  constructor (
    private readonly setState: (currentUser: Authenticator) => void = emptySetState,
    public readonly authorizationHeader: string = '',
    public readonly profile?: Profile
  ) {
  }

  isInitialized (): boolean {
    return this.setState !== emptySetState
  }

  isAuthorized (): boolean {
    return this.profile !== undefined
  }

  async signInPassword (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, { email, password })
      .then(({ data }) => {
        this.update(`Bearer ${data.token}`, data.user)
        return [] as string[]
      })
      .catch(e => {
        this.update(undefined, undefined)
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  signOut (): void {
    this.update(undefined, undefined)
  }

  private update (authorizationHeader?: string, profile?: Profile): void {
    this.setState(new Authenticator(this.setState, authorizationHeader, profile))
  }
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

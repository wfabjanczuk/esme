import React from 'react'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { Profile } from './profile'
import { parseErrorMessage } from '../utils'

const signInUrl = `${config.organizerApiUrl}/auth/sign-in`
const signOutUrl = `${config.organizerApiUrl}/auth/sign-out`
const emptySetState = (): void => {}

interface SignInResponse {
  user: Profile
  token: string
}

export class Authenticator {
  constructor (
    private readonly setState: (authenticator: Authenticator) => void = emptySetState,
    public readonly authorizationHeader: string = '',
    public readonly profile?: Profile
  ) {
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  isAuthorized (): boolean {
    return this.profile !== undefined
  }

  async signIn (email: string, password: string): Promise<string[]> {
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

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(() => this.update(undefined, undefined))
  }

  checkAuthError = (e: AxiosError): void => {
    const code = e?.response?.status
    if (code === undefined) {
      return
    }

    if ([401, 403].includes(code)) {
      void this.signOut()
    }
  }

  private update (authorizationHeader?: string, profile?: Profile): void {
    this.setState(new Authenticator(this.setState, authorizationHeader, profile))
  }
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

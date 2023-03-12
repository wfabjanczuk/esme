import React, { Dispatch, SetStateAction } from 'react'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { parseErrorMessage } from '../utils'

const signInUrl = `${config.participantApiUrl}/auth/sign-in`
const signOutUrl = `${config.participantApiUrl}/auth/sign-out`
const emptySetState = (): void => {}

interface SignInResponse {
  token: string
}

export class Authenticator {
  constructor (
    private readonly setState: Dispatch<SetStateAction<Authenticator>> = emptySetState,
    public readonly authorizationHeader: string = ''
  ) {
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  isAuthorized (): boolean {
    return this.authorizationHeader !== ''
  }

  async signIn (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, { email, password })
      .then(({ data }) => {
        // TODO: use Secure, HttpOnly and SameSite attributes in cookie
        this.refreshState(`Bearer ${data.token}`)
        return [] as string[]
      })
      .catch(e => {
        this.refreshState('')
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(() => {
      this.refreshState('')
      window.location.replace('/')
    })
  }

  isAuthError = (e: AxiosError): boolean => {
    const code = e?.response?.status
    if (code === undefined) {
      return false
    }

    if ([401, 403].includes(code)) {
      void this.signOut()
      return true
    }

    return false
  }

  private refreshState (authorizationHeader: string): void {
    this.setState(new Authenticator(this.setState, authorizationHeader))
  }
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

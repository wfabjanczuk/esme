import React, { Dispatch, SetStateAction } from 'react'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { parseErrorMessage } from '../utils'
import * as SecureStore from 'expo-secure-store'

const secureItemName = 'esme_authorization'
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

  checkSecureStore (): void {
    if (!this.hasState() || this.isAuthorized()) {
      return
    }

    void SecureStore.getItemAsync(secureItemName).then((value) => {
      if (value == null) {
        return
      }

      const { token } = JSON.parse(value) as SignInResponse
      this.refreshState(`Bearer ${token}`)
    })
  }

  async signIn (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, { email, password })
      .then(async ({ data: { token } }) => {
        void SecureStore.setItemAsync(secureItemName, JSON.stringify({ token }))
        this.refreshState(`Bearer ${token}`)
        return [] as string[]
      })
      .catch(e => {
        void SecureStore.deleteItemAsync(secureItemName)
        this.refreshState('')
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(() => {
      void SecureStore.deleteItemAsync(secureItemName)
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

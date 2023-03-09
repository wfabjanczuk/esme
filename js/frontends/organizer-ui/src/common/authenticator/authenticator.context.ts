import React, { Dispatch, SetStateAction } from 'react'
import Cookies from 'js-cookie'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { parseErrorMessage } from '../utils'

const authCookieName = 'esme_authorization'
const signInUrl = `${config.organizerApiUrl}/auth/sign-in`
const signOutUrl = `${config.organizerApiUrl}/auth/sign-out`
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

  checkCookie (): void {
    if (!this.hasState() || this.isAuthorized()) {
      return
    }

    const authCookie = Cookies.get(authCookieName)
    if (authCookie === undefined) {
      return
    }

    const { token } = JSON.parse(authCookie) as SignInResponse
    this.refreshState(`Bearer ${token}`)
  }

  async signIn (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, { email, password })
      .then(({ data }) => {
        // TODO: use Secure, HttpOnly and SameSite attributes in cookie
        Cookies.set(authCookieName, JSON.stringify(data), { expires: 1 })
        this.refreshState(`Bearer ${data.token}`)
        return [] as string[]
      })
      .catch(e => {
        Cookies.remove(authCookieName)
        this.refreshState('')
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(() => {
      Cookies.remove(authCookieName)
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

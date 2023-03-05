import React from 'react'
import Cookies from 'js-cookie'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { Profile } from './profile'
import { parseErrorMessage } from '../utils'

const authCookieName = 'esme_authorization'
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

  checkCookie (): void {
    if (!this.hasState() || this.isAuthorized()) {
      return
    }

    const authCookie = Cookies.get(authCookieName)
    if (authCookie === undefined) {
      return
    }

    const { token, user } = JSON.parse(authCookie) as SignInResponse
    this.update(`Bearer ${token}`, user)
  }

  async signIn (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, { email, password })
      .then(({ data }) => {
        // TODO: use Secure, HttpOnly and SameSite attributes in cookie
        Cookies.set(authCookieName, JSON.stringify(data), { expires: 1 })
        this.update(`Bearer ${data.token}`, data.user)
        return [] as string[]
      })
      .catch(e => {
        Cookies.remove(authCookieName)
        this.update(undefined, undefined)
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(() => {
      Cookies.remove(authCookieName)
      this.update(undefined, undefined)
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

  private update (authorizationHeader?: string, profile?: Profile): void {
    this.setState(new Authenticator(this.setState, authorizationHeader, profile))
  }
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

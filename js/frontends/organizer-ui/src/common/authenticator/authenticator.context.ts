import React, { Dispatch, SetStateAction } from 'react'
import Cookies from 'js-cookie'
import axios, { AxiosError } from 'axios'
import { config } from '../../app/config'
import { parseErrorMessage } from '../utils'
import { Profile } from '../../pages/profile/profile.entity'
import { UserRole } from '../../pages/users/user.entity'

const authCookieName = 'esme_authorization'
const signInUrl = `${config.organizerApiUrl}/auth/sign-in`
const signOutUrl = `${config.organizerApiUrl}/auth/sign-out`
const emptySetState = (): void => {
}

interface SignInResponse {
  token: string
  user: Profile
}

export class Authenticator {
  constructor (
    private readonly setState: Dispatch<SetStateAction<Authenticator>> = emptySetState,
    public readonly authorizationHeader: string = '',
    public readonly isAdmin: boolean = false
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

    const { token, user } = JSON.parse(authCookie) as SignInResponse
    this.refreshState(`Bearer ${token}`, isUserAdmin(user))
  }

  async signIn (email: string, password: string): Promise<string[]> {
    return await axios.post<SignInResponse>(signInUrl, {
      email,
      password
    })
      .then(({ data: { token, user } }) => {
        // TODO: use Secure, HttpOnly and SameSite attributes in cookie
        Cookies.set(authCookieName, JSON.stringify({ token, user }), { expires: 1 })
        this.refreshState(`Bearer ${token}`, isUserAdmin(user))
        return [] as string[]
      })
      .catch(e => {
        Cookies.remove(authCookieName)
        this.refreshState('', false)
        return parseErrorMessage(e?.response?.data?.message)
      })
  }

  async signOut (): Promise<unknown> {
    return await axios.post(signOutUrl, {}, {
      headers: { Authorization: this.authorizationHeader }
    }).finally(this.resetCookie)
  }

  resetCookie (): void {
    Cookies.remove(authCookieName)
    window.location.replace('/')
  }

  isAuthError = (e: AxiosError): boolean => {
    const code = e?.response?.status
    if (code === undefined) {
      return false
    }

    return [401, 403].includes(code)
  }

  parseAuthError = (e: AxiosError): string[] => {
    return this.isAuthError(e)
      ? ['Insufficient privileges']
      : []
  }

  private refreshState (authorizationHeader: string, isAdmin: boolean): void {
    this.setState(new Authenticator(this.setState, authorizationHeader, isAdmin))
  }
}

const isUserAdmin = (user: Profile): boolean => {
  return [UserRole.superAdmin, UserRole.admin].includes(user?.role)
}

export const AuthenticatorContext = React.createContext<Authenticator>(new Authenticator())

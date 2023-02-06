import React from 'react'

export class CurrentUser {
  constructor (
    public setState: (currentUser: CurrentUser) => void,
    public profile?: Profile,
    public authorizationHeader?: string
  ) {
  }

  isAuthorized (): boolean {
    return this.profile !== undefined
  }

  update (profile?: Profile, authorizationHeader?: string): void {
    this.setState(new CurrentUser(this.setState, profile, authorizationHeader))
  }
}

export interface Profile {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  timeCreated: Date
  timeSignOut: Date
  role: UserRole
  agencyId?: number
}

export enum UserRole {
  superAdmin,
  admin,
  agencyOwner,
  agencyManager,
  agencySupport,
}

export const InitialUser = new CurrentUser(() => null)
export const CurrentUserContext = React.createContext<CurrentUser>(InitialUser)

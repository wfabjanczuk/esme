import { config } from '../../app/config'
import { CreateHook, useCreate } from '../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../common/hooks/edit.hook'
import { ListHook, useList } from '../../common/hooks/list.hook'

export interface User {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  timeCreated: string
  timeSignOut: string
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

export const UserRoleLabels = {
  [UserRole.superAdmin]: 'Super admin',
  [UserRole.admin]: 'Admin',
  [UserRole.agencyOwner]: 'Agency owner',
  [UserRole.agencyManager]: 'Agency manager',
  [UserRole.agencySupport]: 'Agency support'
}

const usersApiUrl = `${config.organizerApiUrl}/agency/users`
const usersViewUrl = '/users'

export const useCreateUser = (): CreateHook => useCreate(usersApiUrl, usersViewUrl)

export const useEditUser = (id: number): EditHook<User> =>
  useEdit<User>(id, usersApiUrl, usersViewUrl)

export const useUsersList = (): ListHook<User> =>
  useList<User>(usersApiUrl)

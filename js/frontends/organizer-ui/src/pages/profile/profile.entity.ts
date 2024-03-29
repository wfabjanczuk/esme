import { UserRole } from '../users/user.entity'

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

import { config } from '../../app/config'
import { ListHook, useList } from '../../common/hooks/list.hook'
import { User } from '../users/user.entity'
import { CreateHook, useCreate } from '../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../common/hooks/edit.hook'

const adminUsersApiUrl = `${config.organizerApiUrl}/admin/users`
const adminUsersViewUrl = '/admin/users'

export const useCreateAdminUser = (): CreateHook => useCreate(adminUsersApiUrl, adminUsersViewUrl)

export const useEditAdminUser = (id: number): EditHook<User> =>
  useEdit<User>(id, adminUsersApiUrl, adminUsersViewUrl)

export const useAdminUsersList = (): ListHook<User> =>
  useList<User>(adminUsersApiUrl)

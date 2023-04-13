import { config } from '../../app/config'
import { ListHook, useList } from '../../common/hooks/list.hook'
import { EditHook, useEdit } from '../../common/hooks/edit.hook'
import { Changelog } from '../changelogs/changelog.entity'

const adminChangelogsApiUrl = `${config.organizerApiUrl}/admin/changelogs`

export const useAdminChangelogsList = (): ListHook<Changelog> =>
  useList<Changelog>(adminChangelogsApiUrl)

export const useAdminChangelogDetails = (id: number): Pick<EditHook<Changelog>, 'errorMessages' | 'entity'> =>
  useEdit<Changelog>(id, adminChangelogsApiUrl, '')

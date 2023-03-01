import { ListHook, useList } from '../../common/hooks/list.hook'
import { config } from '../../app/config'
import { EditHook, useEdit } from '../../common/hooks/edit.hook'

export enum ChangeType {
  insert = 'insert',
  update = 'update',
  delete = 'delete',
}

export interface Changelog {
  id: number
  entityId: number
  entityClass: string
  type: ChangeType
  changedAt: string
  valueAfter?: string
  userId?: number
}

const changelogsApiUrl = `${config.organizerApiUrl}/agency/changelogs`

export const useChangelogsList = (): ListHook<Changelog> =>
  useList<Changelog>(changelogsApiUrl)

export const useChangelog = (id: number): Pick<EditHook<Changelog>, 'errorMessages' | 'entity'> =>
  useEdit<Changelog>(id, changelogsApiUrl, '')

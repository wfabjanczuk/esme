import { ListHook, useList } from '../../../common/hooks/list.hook'
import { config } from '../../../app/config'
import { CreateHook, useCreate } from '../../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../../common/hooks/edit.hook'

export interface Announcement {
    id: number
    content: string
    sentAt: Date
    eventId: number
}

const announcementsApiUrl = `${config.organizerApiUrl}/agency/announcements`
const eventsViewUrl = '/events'

export const useCreateAnnouncement = (eventId: number): CreateHook =>
  useCreate(announcementsApiUrl, `${eventsViewUrl}/${eventId}`)

export const useEditAnnouncement = (announcementId: number, eventId: number): EditHook<Announcement> =>
  useEdit<Announcement>(announcementId, announcementsApiUrl, `${eventsViewUrl}/${eventId}`)

export const useAnnouncementsList = (eventId: number): ListHook<Announcement> =>
  useList<Announcement>(`${announcementsApiUrl}?eventId=${eventId}`)

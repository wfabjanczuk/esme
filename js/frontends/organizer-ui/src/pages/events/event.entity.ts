import { EditHook, useEdit } from '../../common/hooks/edit.hook'
import { config } from '../../app/config'
import { ListHook, useList } from '../../common/hooks/list.hook'
import { CreateHook, useCreate } from '../../common/hooks/create.hook'

export interface Event {
  id: number
  name: string
  description: string
  address: string
  lat: number
  lng: number
  timeStart: string
  timeEnd: string
  agencyId: number
}

const eventsApiUrl = `${config.organizerApiUrl}/agency/events`
const eventsViewUrl = '/events'

export const useCreateEvent = (): CreateHook => useCreate(eventsApiUrl, eventsViewUrl)

export const useEditEvent = (id: number): EditHook<Event> =>
  useEdit<Event>(id, eventsApiUrl, eventsViewUrl)

export const useEventDetails = (id: number): Pick<EditHook<Event>, 'errorMessages' | 'entity'> =>
  useEdit<Event>(id, eventsApiUrl, '')

export const useEventsList = (): ListHook<Event> =>
  useList<Event>(eventsApiUrl)

import { EditHook, useEdit } from '../../common/hooks/use-edit.hook'
import { Event as EsmeEvent } from '../../common/events/event'
import { config } from '../../app/config'
import { ListHook, useList } from '../../common/hooks/use-list.hook'
import { CreateHook, useCreate } from '../../common/hooks/use-create.hook'

const eventsApiUrl = `${config.organizerApiUrl}/agency/events`
const eventsViewUrl = '/events'

export const useCreateEvent = (): CreateHook => useCreate(eventsApiUrl, eventsViewUrl)

export const useEditEvent = (id: number): EditHook<EsmeEvent> =>
  useEdit<EsmeEvent>(id, eventsApiUrl, eventsViewUrl)

export const useEventsList = (): ListHook<EsmeEvent> =>
  useList<EsmeEvent>(eventsApiUrl)

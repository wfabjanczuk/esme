import { EditHook, useEdit } from '../../common/hooks/use-edit.hook'
import { Event as EsmeEvent } from '../../common/events/event'
import { config } from '../../app/config'
import { ListHook, useList } from '../../common/hooks/use-list.hook'

const eventsUrl = `${config.organizerApiUrl}/agency/events`
const onDeleteRedirectUrl = '/events'

export const useEvent = (id: number): EditHook<EsmeEvent> =>
  useEdit<EsmeEvent>(id, eventsUrl, onDeleteRedirectUrl)

export const useEvents = (): ListHook<EsmeEvent> =>
  useList<EsmeEvent>(eventsUrl)

import { EntityHook, useEntity } from '../../common/hooks/use-entity.hook'
import { Event as EsmeEvent } from '../../common/events/event'
import { config } from '../../app/config'

const eventsUrl = `${config.organizerApiUrl}/agency/events`
const onDeleteRedirectUrl = '/events'

export const useEvent = (id: number): EntityHook<EsmeEvent> =>
  useEntity<EsmeEvent>(id, eventsUrl, onDeleteRedirectUrl)

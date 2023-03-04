import { ListHook, useList } from '../../../common/hooks/list.hook'
import { config } from '../../../app/config'

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  additionalNotes: string
  eventId: number
  agencyId: number
}

const contactsApiUrl = `${config.organizerApiUrl}/agency/contacts`

export const useContactsList = (eventId: number): ListHook<Contact> =>
  useList<Contact>(`${contactsApiUrl}?eventId=${eventId}`)

import { ListHook, useList } from '../../../common/hooks/list.hook'
import { config } from '../../../app/config'
import { CreateHook, useCreate } from '../../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../../common/hooks/edit.hook'

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
const eventsViewUrl = '/events'

export const useCreateContact = (eventId: number): CreateHook =>
  useCreate(contactsApiUrl, `${eventsViewUrl}/${eventId}`)

export const useEditContact = (contactId: number, eventId: number): EditHook<Contact> =>
  useEdit<Contact>(contactId, contactsApiUrl, `${eventsViewUrl}/${eventId}`)

export const useContactsList = (eventId: number): ListHook<Contact> =>
  useList<Contact>(`${contactsApiUrl}?eventId=${eventId}`)

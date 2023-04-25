import React, { useContext } from 'react'
import { useEventDetails } from '../../pages/events/event.entity'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertStoreContext } from '../alert-bar/alert-store.context'

interface AssociatedEventFieldProps {
  eventId: number
}

export const AssociatedEventField = ({ eventId }: AssociatedEventFieldProps): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const {
    errorMessages,
    entity: event
  } = useEventDetails(eventId)

  if (errorMessages.length > 0) {
    errorMessages.forEach(e => alertStore.add('error', e))
    return <></>
  }
  if (event === undefined) {
    return <></>
  }

  return <TextField
    name='event'
    label='event'
    value={`${event.id} - ${event.name}`}
    sx={styles.forms.field}
    disabled
  />
}

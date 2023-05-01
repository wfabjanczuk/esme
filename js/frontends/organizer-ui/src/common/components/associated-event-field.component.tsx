import React from 'react'
import { useEventDetails } from '../../pages/events/event.entity'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'

interface AssociatedEventFieldProps {
  eventId: number
}

export const AssociatedEventField = ({ eventId }: AssociatedEventFieldProps): JSX.Element => {
  const { entity: event } = useEventDetails(eventId)

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

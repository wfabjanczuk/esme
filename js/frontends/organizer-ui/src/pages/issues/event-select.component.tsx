import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { useEventsList, Event } from '../events/event.entity'

interface EventSelectProps {
  isError: boolean
}

export const EventSelect = ({ isError }: EventSelectProps): JSX.Element => {
  const { list: events } = useEventsList()
  const options = events.map(({ id, name }: Event) => ({ id, label: `${id} - ${name}` }))

  return <Autocomplete
    disablePortal
    options={options}
    renderInput={(params) => <TextField
      {...params}
      name='eventId'
      label='event id'
      error={isError}
      sx={styles.forms.field}
    />}
  />
}

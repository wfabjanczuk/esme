import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../common/styles'
import { FormErrors } from '../../common/form-errors.component'
import { DeleteForever, Save } from '@mui/icons-material'
import { Event as EsmeEvent } from '../../common/events/event'
import React from 'react'
import dayjs from 'dayjs'

interface EventFormProps {
  event?: EsmeEvent
  errorMessages: string[]
}

export const EventForm = ({ event, errorMessages }: EventFormProps): JSX.Element => {
  if (event === undefined) {
    return <></>
  }

  const isError = errorMessages.length > 0

  return <form>
    <Box sx={styles.form}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={event.id}
        sx={styles.formField}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={event.name}
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='description'
        label='description'
        defaultValue={event.description}
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        name='address'
        label='address'
        defaultValue={event.address}
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        type='datetime-local'
        name='timeStart'
        label='start time'
        defaultValue={dayjs(event.timeStart).format('YYYY-MM-DDTHH:mm')}
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='datetime-local'
        name='timeEnd'
        label='end time'
        defaultValue={dayjs(event.timeEnd).format('YYYY-MM-DDTHH:mm')}
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lat'
        label='latitude'
        defaultValue={event.lat}
        sx={styles.formField}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lng'
        label='longitude'
        defaultValue={event.lng}
        sx={styles.formField}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={{
        display: 'flex',
        gap: 40
      }}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttonGroupElement}
          startIcon={<Save/>}
        >
          Save
        </Button>
        <Button type='button' variant='contained' color='error' sx={styles.buttonGroupElement}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}

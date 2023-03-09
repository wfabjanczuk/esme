import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/form-errors.component'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useCreateEvent } from './event.entity'

export const AddEventForm = (): JSX.Element => {
  const { errorMessages, create } = useCreateEvent()
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
    <Box sx={styles.forms.component}>
      <TextField
        name='name'
        label='name'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='description'
        label='description'
        error={isError}
        sx={styles.forms.field}
        minRows={5}
        multiline
      />
      <TextField
        name='address'
        label='address'
        error={isError}
        sx={styles.forms.field}
        multiline
      />
      <TextField
        type='datetime-local'
        name='timeStart'
        label='start time'
        error={isError}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='datetime-local'
        name='timeEnd'
        label='end time'
        error={isError}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lat'
        label='latitude'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lng'
        label='longitude'
        error={isError}
        sx={styles.forms.field}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='contained' color='success' sx={styles.buttons.single}
        startIcon={<Add/>}
      >
        Add
      </Button>
    </Box>
  </form>
}

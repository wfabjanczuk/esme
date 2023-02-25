import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../common/styles'
import { FormErrors } from '../../common/form-errors.component'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useCreateEvent } from './hooks'

export const CreateEventForm = (): JSX.Element => {
  const {
    errorMessages,
    create
  } = useCreateEvent()
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
    <Box sx={styles.form}>
      <TextField
        name='name'
        label='name'
        error={isError}
        sx={styles.formField}
      />
      <TextField
        name='description'
        label='description'
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        name='address'
        label='address'
        error={isError}
        sx={styles.formField}
        multiline
      />
      <TextField
        type='datetime-local'
        name='timeStart'
        label='start time'
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='datetime-local'
        name='timeEnd'
        label='end time'
        error={isError}
        sx={styles.formField}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lat'
        label='latitude'
        error={isError}
        sx={styles.formField}
      />
      <TextField
        type='number'
        inputProps={{ step: 'any' }}
        name='lng'
        label='longitude'
        error={isError}
        sx={styles.formField}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='contained' color='success' sx={{ width: '200px', my: 2 }}
        startIcon={<Add/>}
      >
        Add
      </Button>
    </Box>
  </form>
}

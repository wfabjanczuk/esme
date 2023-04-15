import { Box, Button, TextField } from '@mui/material'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useCreateContact } from './contact.entity'
import { styles } from '../../../layout/styles'
import { FormErrors } from '../../../common/components/form-errors.component'

interface AddContactFormProps {
  eventId: number
}

export const AddContactForm = ({ eventId }: AddContactFormProps): JSX.Element => {
  const { errorMessages, create } = useCreateContact(eventId)
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
    <Box sx={styles.forms.column}>
      <TextField
        name='firstName'
        label='first name'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='lastName'
        label='last name'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='email'
        label='email'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='phoneNumber'
        label='phone number'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='additionalNotes'
        label='additional notes'
        error={isError}
        sx={styles.forms.field}
        multiline
      />
      <TextField
        name='eventId'
        label='event id'
        value={eventId}
        sx={styles.forms.fieldHidden}
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

import { Box, Button, TextField } from '@mui/material'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { useEditContact } from './contact.entity'
import { styles } from '../../../layout/styles'
import { FormErrors } from '../../../common/form-errors.component'

interface EditContactFormProps {
  eventId: number
  contactId: number
}

export const EditContactForm = ({ contactId, eventId }: EditContactFormProps): JSX.Element => {
  const { errorMessages, entity, update, remove } = useEditContact(contactId, eventId)
  const isError = errorMessages.length > 0

  if (entity === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.component}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={entity.id}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='firstName'
        label='first name'
        defaultValue={entity.firstName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='lastName'
        label='last name'
        defaultValue={entity.lastName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='email'
        label='email'
        defaultValue={entity.email}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='phoneNumber'
        label='phone number'
        defaultValue={entity.phoneNumber}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='additionalNotes'
        label='additional notes'
        defaultValue={entity.additionalNotes}
        error={isError}
        sx={styles.forms.field}
        multiline
      />
      <FormErrors errorMessages={errorMessages}/>
      <Box style={styles.buttons.group}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement}
          startIcon={<Save/>}
        >
          Save
        </Button>
        <Button type='button' variant='contained' color='error' sx={styles.buttons.groupElement}
          onClick={remove}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}

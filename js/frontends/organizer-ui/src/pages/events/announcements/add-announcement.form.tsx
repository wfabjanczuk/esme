import { Box, Button, TextField } from '@mui/material'
import { Add } from '@mui/icons-material'
import React from 'react'
import { styles } from '../../../layout/styles'
import { FormErrors } from '../../../common/form-errors.component'
import { useCreateAnnouncement } from './announcement.entity'

interface AddAnnouncementFormProps {
  eventId: number
}

export const AddAnnouncementForm = ({ eventId }: AddAnnouncementFormProps): JSX.Element => {
  const { errorMessages, create } = useCreateAnnouncement(eventId)
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
    <Box sx={styles.forms.component}>
      <TextField
        name='content'
        label='content'
        error={isError}
        sx={styles.forms.field}
        minRows={5}
        multiline
      />
      <TextField
        name='eventId'
        label='event id'
        error={isError}
        value={eventId}
        sx={styles.forms.fieldHidden}
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

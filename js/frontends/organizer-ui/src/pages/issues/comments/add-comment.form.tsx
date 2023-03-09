import { Box, Button, TextField } from '@mui/material'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useCreateComment } from './comment.entity'
import { styles } from '../../../layout/styles'
import { FormErrors } from '../../../common/form-errors.component'

interface AddCommentFormProps {
  issueId: number
}

export const AddCommentForm = ({ issueId }: AddCommentFormProps): JSX.Element => {
  const { errorMessages, create } = useCreateComment(issueId)
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
        name='issueId'
        label='issue id'
        value={issueId}
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

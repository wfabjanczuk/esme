import { Box, Button, TextField } from '@mui/material'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { useEditComment } from './comment.entity'
import { styles } from '../../../layout/styles'
import { FormErrors } from '../../../common/form-errors.component'

interface EditCommentFormProps {
  issueId: number
  commentId: number
}

export const EditCommentForm = ({ commentId, issueId }: EditCommentFormProps): JSX.Element => {
  const { errorMessages, entity, update, remove } = useEditComment(commentId, issueId)
  const isError = errorMessages.length > 0

  if (entity === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.component}>
      <TextField
        name='content'
        label='content'
        defaultValue={entity.content}
        error={isError}
        sx={styles.forms.field}
        minRows={5}
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

import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/components/form-errors.component'
import { Add } from '@mui/icons-material'
import React from 'react'
import { useCreateIssue } from './issue.entity'
import { IssuePrioritySelect } from './issue-priority-select.component'
import { EventSelect } from './event-select.component'

export const AddIssueForm = (): JSX.Element => {
  const {
    errorMessages,
    create
  } = useCreateIssue()
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
    <Box sx={styles.forms.column}>
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
      <IssuePrioritySelect isError={isError}/>
      <EventSelect isError={isError}/>
      <TextField
        name='status'
        label='issue status'
        defaultValue={'to do'}
        sx={styles.forms.field}
        disabled
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

import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/components/form-errors.component'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { useEditIssue } from './issue.entity'
import { IssuePrioritySelect } from './issue-priority-select.component'
import { IssueStatusSelect } from './issue-status-select.component'
import { parseDateTimeValue } from '../../common/utils'
import { AssociatedEventField } from '../../common/components/associated-event-field.component'
import { AssociatedAuthorField } from '../../common/components/associated-author-field.component'

interface EditIssueFormProps {
  id: number
}

export const EditIssueForm = ({ id }: EditIssueFormProps): JSX.Element => {
  const {
    errorMessages,
    entity,
    update,
    remove
  } = useEditIssue(id)
  const isError = errorMessages.length > 0

  if (entity === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.column}>
      <TextField
        type='number'
        name='id'
        label='id'
        defaultValue={entity.id}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='name'
        label='name'
        defaultValue={entity.name}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='description'
        label='description'
        defaultValue={entity.description}
        error={isError}
        sx={styles.forms.field}
        minRows={5}
        multiline
      />
      <IssuePrioritySelect currentValue={entity.priority} isError={isError}/>
      <IssueStatusSelect currentValue={entity.status} isError={isError}/>
      <TextField
        type='datetime-local'
        name='timeCreated'
        label='time created'
        defaultValue={parseDateTimeValue(entity.timeCreated)}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
        disabled
      />
      <TextField
        type={entity.timeClosed != null ? 'datetime-local' : 'text'}
        name='timeClosed'
        label='time closed'
        value={entity.timeClosed != null ? parseDateTimeValue(entity.timeClosed) : '-'}
        sx={styles.forms.field}
        InputLabelProps={{ shrink: true }}
        disabled
      />
      <AssociatedAuthorField authorId={entity.authorId}/>
      <AssociatedEventField eventId={entity.eventId}/>
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

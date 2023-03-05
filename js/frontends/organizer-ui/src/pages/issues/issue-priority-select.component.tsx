import React from 'react'
import { FormControl, MenuItem, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { IssuePrioritiesList, IssuePriority, IssuePriorityLabels, IssueStatus } from './issue.entity'

interface IssuePrioritySelectProps {
  currentValue?: IssueStatus
  isError: boolean
}

export const IssuePrioritySelect = ({ currentValue, isError }: IssuePrioritySelectProps): JSX.Element => {
  const defaultValue = currentValue !== undefined ? currentValue : IssuePriority.medium

  return <FormControl fullWidth>
    <TextField
      select
      name='priority'
      label='issue priority'
      defaultValue={defaultValue}
      error={isError}
      sx={styles.forms.field}
    >
      {IssuePrioritiesList.map(r =>
        <MenuItem key={r} value={r}>{IssuePriorityLabels[r]}</MenuItem>
      )}
    </TextField>
  </FormControl>
}

import React from 'react'
import { FormControl, MenuItem, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { IssueStatus, IssueStatusesList, IssueStatusLabels } from './issue.entity'

interface IssueStatusSelectProps {
  currentValue?: IssueStatus
  isError: boolean
}

export const IssueStatusSelect = ({
  currentValue,
  isError
}: IssueStatusSelectProps): JSX.Element => {
  const defaultValue = currentValue !== undefined ? currentValue : IssueStatusesList[0]

  return <FormControl fullWidth>
    <TextField
      select
      name='status'
      label='issue status'
      defaultValue={defaultValue}
      error={isError}
      sx={styles.forms.field}
    >
      {IssueStatusesList.map(s =>
        <MenuItem key={s} value={s}>{IssueStatusLabels[s]}</MenuItem>
      )}
    </TextField>
  </FormControl>
}

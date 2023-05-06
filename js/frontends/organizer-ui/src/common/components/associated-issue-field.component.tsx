import React from 'react'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { useIssueDetails } from '../../pages/issues/issue.entity'

interface AssociatedIssueFieldProps {
  issueId: number
}

export const AssociatedIssueField = ({ issueId }: AssociatedIssueFieldProps): JSX.Element => {
  const { entity: issue } = useIssueDetails(issueId)

  if (issue === undefined) {
    return <></>
  }

  return <TextField
    name='issue'
    label='issue'
    value={`${issue.id} - ${issue.name}`}
    sx={styles.forms.field}
    disabled
  />
}

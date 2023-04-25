import React, { useContext } from 'react'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertStoreContext } from '../alert-bar/alert-store.context'
import { useIssueDetails } from '../../pages/issues/issue.entity'

interface AssociatedIssueFieldProps {
  issueId: number
}

export const AssociatedIssueField = ({ issueId }: AssociatedIssueFieldProps): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const {
    errorMessages,
    entity: issue
  } = useIssueDetails(issueId)

  if (errorMessages.length > 0) {
    errorMessages.forEach(e => alertStore.add('error', e))
    return <></>
  }
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

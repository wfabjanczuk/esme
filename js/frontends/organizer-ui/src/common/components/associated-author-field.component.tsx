import React, { useContext } from 'react'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertStoreContext } from '../alert-bar/alert-store.context'
import { useUserDetails } from '../../pages/users/user.entity'

interface AssociatedAuthorFieldProps {
  authorId: number
}

export const AssociatedAuthorField = ({ authorId }: AssociatedAuthorFieldProps): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const {
    errorMessages,
    entity: author
  } = useUserDetails(authorId)

  if (errorMessages.length > 0) {
    errorMessages.forEach(e => alertStore.add('error', e))
    return <></>
  }
  if (author === undefined) {
    return <></>
  }

  return <TextField
    name='author'
    label='author'
    value={`${author.id} - ${author.firstName} ${author.lastName}`}
    sx={styles.forms.field}
    disabled
  />
}

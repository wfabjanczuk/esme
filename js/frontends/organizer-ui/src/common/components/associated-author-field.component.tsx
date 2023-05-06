import React from 'react'
import { TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { useUserDetails } from '../../pages/users/user.entity'

interface AssociatedAuthorFieldProps {
  authorId: number
}

export const AssociatedAuthorField = ({ authorId }: AssociatedAuthorFieldProps): JSX.Element => {
  const { entity: author } = useUserDetails(authorId)

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

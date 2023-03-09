import { Alert, Typography } from '@mui/material'
import React from 'react'
import { styles } from '../layout/styles'

interface FormErrorsProps {
  errorMessages: string[]
}

export const FormErrors = ({ errorMessages }: FormErrorsProps): JSX.Element => {
  if (errorMessages.length === 0) {
    return <></>
  }

  return <Alert severity='error' icon={false} sx={styles.forms.error}>
    {errorMessages.map((m, i) => (
      <Typography key={i} component='div' variant='caption'>{m}</Typography>
    ))}
  </Alert>
}

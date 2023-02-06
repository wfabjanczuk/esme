import { Alert, Typography } from '@mui/material'
import { styles } from './sign-in-view.styles'
import React from 'react'

interface FormErrorsProps {
  errorMessages: string[]
}

export const FormErrors = ({ errorMessages }: FormErrorsProps): JSX.Element => {
  if (errorMessages.length === 0) {
    return <></>
  }

  return <Alert severity='error' icon={false} sx={styles.formErrors}>
    {errorMessages.map((m, i) => (
      <Typography key={i} component='div' variant='caption'>{m}</Typography>
    ))}
  </Alert>
}

export const parseErrorMessage = (message: string[] | string | undefined): string[] => {
  if (message === undefined) {
    return []
  }

  if (typeof message === 'string') {
    return [message]
  }

  return message
}

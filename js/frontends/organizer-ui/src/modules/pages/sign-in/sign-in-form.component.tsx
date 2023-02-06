import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { styles } from './sign-in.styles'
import React, { FormEvent } from 'react'

interface SignInFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  errorMessages: string[]
}

export const SignInForm = ({ handleSubmit, errorMessages }: SignInFormProps): JSX.Element =>
  <form onSubmit={handleSubmit}>
    <Box sx={styles.form}>
      <TextField name='email' label='email' error={errorMessages.length > 0} sx={styles.formField}/>
      <TextField type='password' name='password' label='password' error={errorMessages.length > 0}
        sx={styles.formField}/>
      <SignInFormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='outlined' sx={styles.formButton}>Sign in</Button>
    </Box>
  </form>

interface FormErrorsProps {
  errorMessages: string[]
}

const SignInFormErrors = ({ errorMessages }: FormErrorsProps): JSX.Element => {
  if (errorMessages.length === 0) {
    return <></>
  }

  return <Alert severity='error' icon={false} sx={styles.formErrors}>
    {errorMessages.map((m, i) => (
      <Typography key={i} component='div' variant='caption'>{m}</Typography>
    ))}
  </Alert>
}

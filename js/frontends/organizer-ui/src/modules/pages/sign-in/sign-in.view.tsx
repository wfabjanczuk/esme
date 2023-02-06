import React, { FormEvent, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from './sign-in.styles'
import { Authenticator, AuthenticatorContext } from '../../auth/authenticator.context'
import { SignInForm } from './sign-in-form.component'

export const SignInView = (): JSX.Element => {
  const authenticator = useContext(AuthenticatorContext)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmitAsync(e, authenticator, setErrorMessages)
  }

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <Paper sx={styles.card}>
        <Typography variant='h4' component='h1' sx={styles.header}>Emergency Service</Typography>
        <SignInForm handleSubmit={handleSubmit} errorMessages={errorMessages}/>
      </Paper>
    </Box>
  </Box>
}

const handleSubmitAsync = async (
  e: FormEvent<HTMLFormElement>,
  authenticator: Authenticator,
  setErrorMessages: (errorMessages: string[]) => void
): Promise<void> => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  setErrorMessages(await authenticator.signInPassword(email, password))
}

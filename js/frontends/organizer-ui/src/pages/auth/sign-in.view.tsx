import React, { FormEvent, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { SignInForm } from './sign-in.form'
import { styles } from '../../common/styles'

export const SignInView = (): JSX.Element => {
  const authenticator = useContext(AuthenticatorContext)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmitAsync(e, authenticator, setErrorMessages)
  }

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <Paper sx={styles.cardSm}>
        <Typography variant='h4' component='h1' sx={styles.header}>Emergency service</Typography>
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

  setErrorMessages(await authenticator.signIn(email, password))
}

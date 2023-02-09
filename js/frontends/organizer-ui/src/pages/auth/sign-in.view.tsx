import React, { FormEvent, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { Authenticator, AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { SignInForm } from './sign-in.form'
import { styles } from '../../common/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const SignInView = (): JSX.Element => {
  const authenticator = useContext(AuthenticatorContext)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmitAsync(e, authenticator, setErrorMessages)
  }

  void authenticator.signIn('jan@kowalski.com', '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?')

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <AlertBar maxWidth='480px'/>
      <Paper sx={{ ...styles.card, maxWidth: '480px' }}>
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

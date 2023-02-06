import React, { useContext, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from './sign-in-view.styles'
import { CurrentUserContext } from './current-user-context'
import { authenticate } from './authenticate'
import { FormErrors } from './form-errors.component'

export const SignInView = (): JSX.Element => {
  const currentUser = useContext(CurrentUserContext)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const foundErrors = errorMessages.length > 0

  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <Paper sx={styles.card}>
        <Typography variant='h4' component='h1' sx={styles.header}>Emergency Service</Typography>
        <form onSubmit={(e) => authenticate(e, currentUser, setErrorMessages)}>
          <Box sx={styles.form}>
            <TextField name='email' label='email' error={foundErrors} sx={styles.formField}/>
            <TextField type='password' name='password' label='password' error={foundErrors}
              sx={styles.formField}/>
            <FormErrors errorMessages={errorMessages}/>
            <Button type='submit' variant='outlined' sx={styles.formButton}>Sign in</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  </Box>
}

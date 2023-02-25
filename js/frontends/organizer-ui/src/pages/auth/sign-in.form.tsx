import { Box, Button, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { FormErrors } from '../../common/form-errors.component'
import { styles } from '../../common/styles'
import { ButtonGroup } from '../../common/button-group.component'
import { Link } from 'react-router-dom'
import { Login, PersonAdd } from '@mui/icons-material'
import { useSignIn } from './sign-in.hook'
import { AuthenticatorContext } from '../../common/authenticator/authenticator.context'

export const SignInForm = (): JSX.Element => {
  const { signIn, errorMessages } = useSignIn()
  const isError = errorMessages.length > 0

  const authenticator = useContext(AuthenticatorContext)
  void authenticator.signIn('jan@kowalski.com', '&Y+sFaS{&d>8ycO)FLhF41qiQk{IYEb?')

  return <form onSubmit={signIn}>
    <Box sx={styles.form}>
      <TextField
        name='email'
        label='email'
        error={isError}
        sx={styles.formField}
      />
      <TextField
        type='password'
        name='password'
        label='password'
        error={isError}
        sx={styles.formField}
      />
      <FormErrors errorMessages={errorMessages}/>
      <ButtonGroup>
        <Button type='submit' variant='contained' sx={styles.buttonGroupElement} startIcon={<Login/>}>
          Sign in
        </Button>
        <Link to={'/register'} style={styles.link}>
          <Button type='button' variant='contained' color='success' sx={styles.linkButton} startIcon={<PersonAdd/>}>
            Register
          </Button>
        </Link>
      </ButtonGroup>
    </Box>
  </form>
}

import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import { FormErrors } from '../../common/components/form-errors.component'
import { styles } from '../../layout/styles'
import { ButtonGroup } from '../../common/components/button-group.component'
import { Link } from 'react-router-dom'
import { Login, PersonAdd } from '@mui/icons-material'
import { useSignIn } from './sign-in.hook'

export const SignInForm = (): JSX.Element => {
  const {
    signIn,
    errorMessages
  } = useSignIn()
  const isError = errorMessages.length > 0

  return <form onSubmit={signIn}>
    <Box sx={styles.forms.column}>
      <TextField
        name='email'
        label='email'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        type='password'
        name='password'
        label='password'
        error={isError}
        sx={styles.forms.field}
      />
      <FormErrors errorMessages={errorMessages}/>
      <ButtonGroup>
        <Button type='submit' variant='contained' sx={styles.buttons.groupElement}
          startIcon={<Login/>}>
          Sign in
        </Button>
        <Link to={'/register'} style={styles.links.componentGrow}>
          <Button type='button' variant='contained' color='success' sx={styles.buttons.groupElementLink}
            startIcon={<PersonAdd/>}>
            Register
          </Button>
        </Link>
      </ButtonGroup>
    </Box>
  </form>
}

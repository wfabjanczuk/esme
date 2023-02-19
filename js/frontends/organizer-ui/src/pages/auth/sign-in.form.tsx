import { Box, Button, TextField } from '@mui/material'
import React, { FormEvent } from 'react'
import { FormErrors } from '../../common/form-errors.component'
import { styles } from '../../common/styles'
import { ButtonGroup } from '../../common/button-group.component'
import { Link } from 'react-router-dom'
import { Login, PersonAdd } from '@mui/icons-material'

interface SignInFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  errorMessages: string[]
}

export const SignInForm = ({ handleSubmit, errorMessages }: SignInFormProps): JSX.Element => {
  const isError = errorMessages.length > 0

  return <form onSubmit={handleSubmit}>
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

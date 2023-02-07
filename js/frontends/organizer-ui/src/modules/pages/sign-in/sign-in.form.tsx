import { Box, Button, TextField } from '@mui/material'
import React, { FormEvent } from 'react'
import { FormErrors } from '../common/form-errors.component'
import { styles } from '../common/styles'
import { ButtonGroup } from '../common/button-group.component'

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
        <Button type='submit' variant='contained' sx={styles.formButton}>Sign in</Button>
        <Button type='submit' variant='contained' color='success' sx={styles.formButton}>Register</Button>
      </ButtonGroup>
    </Box>
  </form>
}

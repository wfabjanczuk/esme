import React from 'react'
import { styles } from '../../layout/styles'
import { Box, Button, TextField } from '@mui/material'
import { FormErrors } from '../../common/form-errors.component'
import { ButtonGroup } from '../../common/button-group.component'
import { Link } from 'react-router-dom'
import { Close, PersonAdd } from '@mui/icons-material'
import { useSignUp } from './sign-up.hook'

export const SignUpForm = (): JSX.Element => {
  const {
    signUp,
    errorMessages
  } = useSignUp()
  const isError = errorMessages.length > 0

  return <form onSubmit={signUp}>
    <Box sx={styles.forms.doubleContainer}>
      <Box sx={styles.forms.column}>
        <Box sx={styles.forms.component}>
          <TextField
            name='name'
            label='agency name'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            name='address'
            label='agency address'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            name='website'
            label='agency website'
            error={isError}
            sx={styles.forms.field}
          />
        </Box>
        <FormErrors errorMessages={errorMessages}/>
      </Box>
      <Box sx={styles.forms.column}>
        <Box sx={styles.forms.component}>
          <TextField
            name='email'
            label='owner email'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            type='password'
            name='password'
            label='owner password'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            type='password'
            name='confirmPassword'
            label='owner confirm password'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            name='firstName'
            label='owner first name'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            name='lastName'
            label='owner last name'
            error={isError}
            sx={styles.forms.field}
          />
          <TextField
            name='phoneNumber'
            label='owner phone number'
            error={isError}
            sx={styles.forms.field}
          />
        </Box>
      </Box>
    </Box>
    <ButtonGroup>
      <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement}
        startIcon={<PersonAdd/>}>
        Register
      </Button>
      <Link to={'/'} style={styles.links.componentGrow}>
        <Button type='button' variant='contained' color='error' sx={styles.buttons.groupElementLink}
          startIcon={<Close/>}>
          Cancel
        </Button>
      </Link>
    </ButtonGroup>
  </form>
}

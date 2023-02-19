import React, { FormEvent } from 'react'
import { styles } from '../../common/styles'
import { Box, Button, TextField, Typography } from '@mui/material'
import { FormErrors } from '../../common/form-errors.component'
import { ButtonGroup } from '../../common/button-group.component'
import { Link } from 'react-router-dom'
import { Close, PersonAdd } from '@mui/icons-material'

interface SignUpFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  errorMessages: string[]
}

export const SignUpForm = ({ handleSubmit, errorMessages }: SignUpFormProps): JSX.Element => {
  const isError = errorMessages.length > 0

  return <form onSubmit={handleSubmit}>
    <Box style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
      <Box sx={{ maxWidth: '420px', flexGrow: 1 }}>
        <Typography>new agency:</Typography>
        <Box sx={styles.form}>
          <TextField
            name='name'
            label='agency name'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='address'
            label='agency address'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='website'
            label='agency website'
            error={isError}
            sx={styles.formField}
          />
        </Box>
        <FormErrors errorMessages={errorMessages}/>
      </Box>
      <Box sx={{ maxWidth: '420px', flexGrow: 1 }}>
        <Box sx={styles.form}>
          <Typography>new account for the owner:</Typography>
          <TextField
            name='email'
            label='owner email'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            type='password'
            name='password'
            label='owner password'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            type='password'
            name='confirmPassword'
            label='owner confirm password'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='firstName'
            label='owner first name'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='lastName'
            label='owner last name'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='phoneNumber'
            label='owner phone number'
            error={isError}
            sx={styles.formField}
          />
        </Box>
      </Box>
    </Box>
    <ButtonGroup>
      <Button type='submit' variant='contained' color='success' sx={styles.buttonGroupElement} startIcon={<PersonAdd/>}>
        Register
      </Button>
      <Link to={'/'} style={styles.link}>
        <Button type='button' variant='contained' color='error' sx={styles.linkButton} startIcon={<Close/>}>
          Cancel
        </Button>
      </Link>
    </ButtonGroup>
  </form>
}

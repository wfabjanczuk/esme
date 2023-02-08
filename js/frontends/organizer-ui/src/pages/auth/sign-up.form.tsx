import React, { FormEvent } from 'react'
import { styles } from '../common/styles'
import { Box, Button, TextField, Typography } from '@mui/material'
import { FormErrors } from '../common/form-errors.component'
import { ButtonGroup } from '../common/button-group.component'
import { Link } from 'react-router-dom'

interface SignUpFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  errorMessages: string[]
}

export const SignUpForm = ({ handleSubmit, errorMessages }: SignUpFormProps): JSX.Element => {
  const isError = errorMessages.length > 0

  return <form onSubmit={handleSubmit}>
    <Box style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
      <Box sx={{ maxWidth: '420px', flexGrow: 1 }}>
        <Box sx={styles.form}>
          <Typography>Fill owner data:</Typography>
          <TextField
            name='email'
            label='owner email'
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
          <TextField
            type='password'
            name='confirmPassword'
            label='confirm password'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='firstName'
            label='first name'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='lastName'
            label='last name'
            error={isError}
            sx={styles.formField}
          />
          <TextField
            name='phoneNumber'
            label='phone number'
            error={isError}
            sx={styles.formField}
          />
        </Box>
      </Box>
      <Box sx={{ maxWidth: '420px', flexGrow: 1 }}>
        <Typography>Fill agency data:</Typography>
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
    </Box>
    <ButtonGroup>
      <Button type='submit' variant='contained' sx={styles.buttonGroupElement}>Register</Button>
      <Link to={'/'} style={styles.link}>
        <Button type='button' variant='contained' color='secondary' sx={styles.linkButton}>Go back</Button>
      </Link>
    </ButtonGroup>
  </form>
}

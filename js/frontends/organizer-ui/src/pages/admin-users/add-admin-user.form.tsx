import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/components/form-errors.component'
import { Add } from '@mui/icons-material'
import React from 'react'
import { UserRole } from '../users/user.entity'
import { useCreateAdminUser } from './admin-user.hook'

export const AddAdminUserForm = (): JSX.Element => {
  const {
    errorMessages,
    create
  } = useCreateAdminUser()
  const isError = errorMessages.length > 0

  return <form onSubmit={create}>
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
      <TextField
        type='password'
        name='confirmPassword'
        label='confirm password'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='firstName'
        label='first name'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='lastName'
        label='last name'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='phoneNumber'
        label='phone number'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='role'
        label='user role'
        error={isError}
        value={UserRole.admin}
        sx={styles.forms.fieldHidden}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='contained' color='success' sx={styles.buttons.single}
        startIcon={<Add/>}
      >
        Add
      </Button>
    </Box>
  </form>
}

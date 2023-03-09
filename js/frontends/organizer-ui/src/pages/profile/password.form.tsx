import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { LockReset } from '@mui/icons-material'
import React from 'react'
import { useChangePassword } from './password.hook'
import { FormErrors } from '../../common/form-errors.component'

export const ChangePasswordForm = (): JSX.Element => {
  const { errorMessages, changePassword } = useChangePassword()
  const isError = errorMessages.length > 0

  return <form onSubmit={changePassword}>
    <Box sx={styles.forms.component}>
      <TextField
        type='password'
        name='oldPassword'
        label='old password'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        type='password'
        name='newPassword'
        label='new password'
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        type='password'
        name='confirmNewPassword'
        label='confirm new password'
        error={isError}
        sx={styles.forms.field}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='contained' color='error' sx={styles.buttons.single}
        startIcon={<LockReset/>}
      >
        Change password
      </Button>
    </Box>
  </form>
}

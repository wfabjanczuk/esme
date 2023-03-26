import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { Save } from '@mui/icons-material'
import React from 'react'
import { useEditProfile } from './profile.hook'
import { FormErrors } from '../../common/form-errors.component'

export const EditProfileForm = (): JSX.Element => {
  const { profile, errorMessages, update } = useEditProfile()
  const isError = errorMessages.length > 0

  if (profile === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.column}>
      <TextField
        name='email'
        label='email'
        defaultValue={profile.email}
        sx={styles.forms.field}
        disabled
      />
      <TextField
        name='firstName'
        label='first name'
        defaultValue={profile.firstName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='lastName'
        label='last name'
        defaultValue={profile.lastName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='phoneNumber'
        label='phone number'
        defaultValue={profile.phoneNumber}
        error={isError}
        sx={styles.forms.field}
      />
      <FormErrors errorMessages={errorMessages}/>
      <Button type='submit' variant='contained' color='success' sx={styles.buttons.single}
        startIcon={<Save/>}
      >
        Save
      </Button>
    </Box>
  </form>
}

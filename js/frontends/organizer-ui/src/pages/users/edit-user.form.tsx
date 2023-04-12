import { Box, Button, TextField } from '@mui/material'
import { styles } from '../../layout/styles'
import { FormErrors } from '../../common/form-errors.component'
import { DeleteForever, Save } from '@mui/icons-material'
import React from 'react'
import { useEditUser } from './user.entity'
import { UserRoleSelect } from './user-role-select.component'
import { useProfileDetails } from '../profile/profile.hook'

interface EditUserFormProps {
  id: number
}

export const EditUserForm = ({ id }: EditUserFormProps): JSX.Element => {
  const {
    errorMessages,
    entity,
    update,
    remove
  } = useEditUser(id)
  const { profile } = useProfileDetails()
  if (profile === undefined) {
    return <></>
  }
  const isError = errorMessages.length > 0

  if (entity === undefined) {
    return <></>
  }

  return <form onSubmit={update}>
    <Box sx={styles.forms.column}>
      <TextField
        name='firstName'
        label='first name'
        defaultValue={entity.firstName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='lastName'
        label='last name'
        defaultValue={entity.lastName}
        error={isError}
        sx={styles.forms.field}
      />
      <TextField
        name='phoneNumber'
        label='phone number'
        defaultValue={entity.phoneNumber}
        error={isError}
        sx={styles.forms.field}
      />
      <UserRoleSelect currentValue={entity.role} isError={isError} profile={profile}/>
      <FormErrors errorMessages={errorMessages}/>
      <Box style={styles.buttons.group}>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.groupElement}
          startIcon={<Save/>}
        >
          Save
        </Button>
        <Button type='button' variant='contained' color='error' sx={styles.buttons.groupElement}
          onClick={remove}
          startIcon={<DeleteForever/>}>
          Delete
        </Button>
      </Box>
    </Box>
  </form>
}

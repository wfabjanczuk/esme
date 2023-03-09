import React from 'react'
import { FormControl, MenuItem, TextField } from '@mui/material'
import { Profile } from '../profile/profile.entity'
import { UserRole, UserRoleLabels } from './user.entity'
import { styles } from '../../layout/styles'
import { useProfileDetails } from '../profile/profile.hook'

interface UserRoleSelectProps {
  currentValue?: UserRole
  isError: boolean
}

export const UserRoleSelect = ({ currentValue, isError }: UserRoleSelectProps): JSX.Element => {
  const { profile } = useProfileDetails()
  if (profile === undefined) {
    return <></>
  }

  const roles = filterRoles(profile)
  const defaultValue = currentValue !== undefined ? currentValue : roles[0]

  return <FormControl fullWidth>
    <TextField
      select
      name='role'
      label='user role'
      defaultValue={defaultValue}
      error={isError}
      sx={styles.forms.field}
    >
      {roles.map(r =>
        <MenuItem key={r} value={r}>{UserRoleLabels[r]}</MenuItem>
      )}
    </TextField>
  </FormControl>
}

const filterRoles = (profile: Profile): UserRole[] => {
  return [
    UserRole.agencyManager,
    UserRole.agencySupport
  ].filter(r => r > profile.role)
}

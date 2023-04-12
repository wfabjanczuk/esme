import React, { useState } from 'react'
import { FormControl, MenuItem, TextField } from '@mui/material'
import { Profile } from '../profile/profile.entity'
import { UserRole, UserRoleLabels } from './user.entity'
import { styles } from '../../layout/styles'

interface UserRoleSelectProps {
  profile: Profile
  currentValue?: UserRole
  isError: boolean
}

export const UserRoleSelect = ({
  currentValue,
  isError,
  profile
}: UserRoleSelectProps): JSX.Element => {
  const roles = filterRoles(profile)
  const [role, setRole] = useState(currentValue !== undefined ? currentValue : roles[0])

  return <FormControl fullWidth>
    <TextField
      select
      name='role'
      label='user role'
      value={role}
      onChange={e => setRole(parseInt(e.target.value, 10))}
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
    UserRole.agencySupport,
    UserRole.agencyManager
  ].filter(r => r > profile.role)
}

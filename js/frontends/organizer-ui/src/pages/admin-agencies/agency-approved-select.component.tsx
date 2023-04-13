import React, { useState } from 'react'
import { FormControl, MenuItem, TextField } from '@mui/material'
import { styles } from '../../layout/styles'

interface AgencyApprovedSelectProps {
  currentValue: boolean
  isError: boolean
}

export const AgencyApprovedSelect = ({
  currentValue,
  isError
}: AgencyApprovedSelectProps): JSX.Element => {
  const [approved, setApproved] = useState(currentValue ? 'true' : 'false')

  return <FormControl fullWidth>
    <TextField
      select
      name='approved'
      label='approved'
      value={approved}
      onChange={e => setApproved(e.target.value)}
      error={isError}
      sx={styles.forms.field}
    >
      <MenuItem key={'true'} value={'true'}>true</MenuItem>
      <MenuItem key={'false'} value={'false'}>false</MenuItem>
    </TextField>
  </FormControl>
}

import { NavLink } from 'react-router-dom'
import { styles } from '../layout/styles'
import { Button } from '@mui/material'
import { Edit } from '@mui/icons-material'
import React from 'react'

interface EditTableRowButtonProps {
  editUrl: string
}

export const EditTableRowButton = ({ editUrl }: EditTableRowButtonProps): JSX.Element => {
  return <NavLink to={editUrl} style={styles.links.componentFull}>
    <Button color='primary' startIcon={<Edit/>} sx={styles.layout.fullWidth}>
      Edit
    </Button>
  </NavLink>
}

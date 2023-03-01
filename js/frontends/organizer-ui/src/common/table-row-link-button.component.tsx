import { NavLink } from 'react-router-dom'
import { styles } from '../layout/styles'
import { Button } from '@mui/material'
import React from 'react'

interface TableRowLinkButtonProps {
  label: string
  url: string
  icon: React.ReactNode
}

export const TableRowLinkButton = ({ label, url, icon }: TableRowLinkButtonProps): JSX.Element => {
  return <NavLink to={url} style={styles.links.componentFull}>
    <Button color='primary' startIcon={icon} sx={styles.layout.fullWidth}>
      {label}
    </Button>
  </NavLink>
}

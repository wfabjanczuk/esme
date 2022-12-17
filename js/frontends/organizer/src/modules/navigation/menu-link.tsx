import { NavLink } from 'react-router-dom'
import { ListItemButton, Typography } from '@mui/material'
import React from 'react'

interface Props {
  url: string
  label: string
}

const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit'
}

export const MenuLink = ({ url, label }: Props): JSX.Element => (
  <NavLink to={url} style={linkStyle} >
    <ListItemButton>
      <Typography color='inherit' ml={1}>
        {label}
      </Typography>
    </ListItemButton>
  </NavLink>
)

import { NavLink } from 'react-router-dom'
import { ListItemButton, ListItemIcon, Typography } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'
import React from 'react'

interface Props {
  url: string
  label: string
}

const linkStyle = {
  color: 'black',
  textDecoration: 'inherit'
}

export const MenuHeader = ({ url, label }: Props): JSX.Element => (
  <NavLink to={url} style={linkStyle}>
    <ListItemButton>
      <ListItemIcon>
        <HomeIcon color='inherit' fontSize='large'/>
      </ListItemIcon>
      <Typography color='inherit' component='h1' variant='h6'>{label}</Typography>
    </ListItemButton>
  </NavLink>
)

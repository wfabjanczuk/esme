import React from 'react'
import { Box, Divider } from '@mui/material'
import { MenuLink } from './menu-link'
import { MenuHeader } from './menu-header'

const containerStyle = {
  width: '280px',
  height: '100%',
  overflow: 'auto'
}

export const Menu = (): JSX.Element => {
  return <Box sx={containerStyle}>
    <MenuHeader url='/' label='Organizer'/>
    <Divider/>
    <MenuLink url='/users' label='Users'/>
    <MenuLink url='/agencies' label='Agencies'/>
    <MenuLink url='/events' label='Events'/>
    <MenuLink url='/issues' label='Issues'/>
    <MenuLink url='/error' label='Error'/>
  </Box>
}

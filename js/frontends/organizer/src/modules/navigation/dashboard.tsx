import React from 'react'
import { Box, Divider } from '@mui/material'
import { Menu } from './menu'
import { Outlet } from 'react-router-dom'

const rootStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex'
}

const outletStyle = {
  flexGrow: '1',
  height: '100%',
  overflow: 'auto'
}

export const Dashboard = (): JSX.Element => <Box sx={rootStyle}>
  <Menu/>
  <Divider orientation='vertical' flexItem/>
  <Box sx={outletStyle}>
    <Outlet/>
  </Box>
</Box>

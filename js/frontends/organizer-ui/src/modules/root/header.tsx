import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import { DashboardOutletContext } from '../dashboard/dashboard'

export interface HeaderProps {
  title: string
}

export default function Header (props: HeaderProps): JSX.Element {
  const { onDrawerToggle } = useOutletContext<DashboardOutletContext>()

  return (
    <React.Fragment>
      <AppBar
        component='div'
        color='primary'
        position='static'
        elevation={0}
        sx={{ zIndex: 0, display: 'flex', justifyContent: 'center', p: 1 }}
      >
        <Toolbar>
          <Box sx={{ display: { sm: 'none', xs: 'block' }, mr: 2 }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={onDrawerToggle}
              edge='start'
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography color='inherit' variant='h5' component='h1'>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

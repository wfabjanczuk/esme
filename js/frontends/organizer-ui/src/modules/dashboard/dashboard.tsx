import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Menu from './menu'
import { Outlet } from 'react-router-dom'
import { Theme } from './theme'

const drawerWidth = 256

export interface DashboardOutletContext {
  onDrawerToggle: () => void
}

export const Dashboard = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isSmUp = useMediaQuery(Theme.breakpoints.up('sm'))

  const handleDrawerToggle = (): void => setMobileOpen(!mobileOpen)
  const outletContext: DashboardOutletContext = {
    onDrawerToggle: handleDrawerToggle
  }

  return (
    <ThemeProvider theme={Theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline/>
        <Box
          component='nav'
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp
            ? null
            : (<Menu
              PaperProps={{ style: { width: drawerWidth } }}
              variant='temporary'
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />)
          }
          <Menu
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet context={outletContext}/>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

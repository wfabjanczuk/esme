import * as React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Menu from './menu'
import { Outlet } from 'react-router-dom'
import { Theme } from './theme'
import { InboxContext } from '../common/messenger/inbox.context'
import { useNewMessenger } from '../common/messenger/messenger.hook'
import { MessengerContext } from '../common/messenger/messenger.context'

const drawerWidth = 256

export interface LayoutOutletContext {
  onDrawerToggle: () => void
}

export const Layout = (): JSX.Element => {
  const { messenger, inbox } = useNewMessenger()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isSmUp = useMediaQuery(Theme.breakpoints.up('sm'))

  if (!messenger.isInitialized()) {
    return <></>
  }

  const handleDrawerToggle = (): void => setMobileOpen(!mobileOpen)
  const outletContext: LayoutOutletContext = {
    onDrawerToggle: handleDrawerToggle
  }

  return (
    <MessengerContext.Provider value={messenger}>
      <InboxContext.Provider value={inbox}>
        <Box sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden'
        }}>
          <Box
            component='nav'
            sx={{
              width: { sm: drawerWidth },
              flexShrink: { sm: 0 },
              height: '100%'
            }}
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
              sx={{
                display: {
                  sm: 'block',
                  xs: 'none'
                }
              }}
            />
          </Box>
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '100%'
          }}>
            <Outlet context={outletContext}/>
          </Box>
        </Box>
      </InboxContext.Provider>
    </MessengerContext.Provider>
  )
}

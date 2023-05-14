import * as React from 'react'
import { useContext } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Menu from './menu'
import { Outlet } from 'react-router-dom'
import { Theme } from './theme'
import { InboxContext } from '../common/messenger/inbox.context'
import { useNewMessenger } from '../common/messenger/messenger.hook'
import { MessengerContext } from '../common/messenger/messenger.context'
import { ChatStarterContext } from '../common/messenger/chat-starter.context'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'

export const Root = (): JSX.Element => {
  const { isAdmin } = useContext(AuthenticatorContext)

  return isAdmin
    ? <Layout/>
    : <MessengerContainer><Layout/></MessengerContainer>
}

interface MessengerContainerProps {
  children: JSX.Element
}

const MessengerContainer = ({ children }: MessengerContainerProps): JSX.Element => {
  const {
    messenger,
    inbox,
    chatStarter
  } = useNewMessenger()

  return (
    <MessengerContext.Provider value={messenger}>
      <InboxContext.Provider value={inbox}>
        <ChatStarterContext.Provider value={chatStarter}>
          {children}
        </ChatStarterContext.Provider>
      </InboxContext.Provider>
    </MessengerContext.Provider>
  )
}

const drawerWidth = 256

export interface LayoutOutletContext {
  onDrawerToggle: () => void
}

const Layout = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isSmUp = useMediaQuery(Theme.breakpoints.up('sm'))

  const handleDrawerToggle = (): void => setMobileOpen(!mobileOpen)
  const outletContext: LayoutOutletContext = {
    onDrawerToggle: handleDrawerToggle
  }

  return (
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
        maxHeight: '100%',
        overflow: 'auto'
      }}>
        <Outlet context={outletContext}/>
      </Box>
    </Box>
  )
}

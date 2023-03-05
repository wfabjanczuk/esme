import * as React from 'react'
import Divider from '@mui/material/Divider'
import Drawer, { DrawerProps } from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PeopleIcon from '@mui/icons-material/People'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import CellTowerIcon from '@mui/icons-material/CellTower'
import { NavLink, useLocation } from 'react-router-dom'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { useContext } from 'react'
import { styles } from './styles'

const categories = [
  {
    id: 'Organizer',
    children: [
      {
        id: 'Agency',
        icon: <WorkOutlineIcon/>,
        route: '/'
      },
      {
        id: 'Users',
        icon: <PeopleIcon/>,
        route: '/users'
      },
      {
        id: 'Events',
        icon: <StarOutlineIcon/>,
        route: '/events'
      },
      {
        id: 'Issues',
        icon: <AssignmentOutlinedIcon/>,
        route: '/issues'
      },
      {
        id: 'Changelogs',
        icon: <HistoryOutlinedIcon/>,
        route: '/changelogs'
      }
    ]
  },
  {
    id: 'Messenger',
    children: [
      {
        id: 'Live support',
        icon: <CellTowerIcon/>,
        route: '/support'
      }
    ]
  }
]

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
}

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3
}

export default function Menu (props: DrawerProps): JSX.Element {
  const location = useLocation()
  const { ...other } = props

  const isRouteMatching = (route: string): boolean => {
    if (route === '/') {
      return location.pathname === route
    }
    return location.pathname.startsWith(route)
  }

  return (
    <Drawer variant='permanent' {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          Emergency Service
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ backgroundColor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, route }) => (
              <ListItem disablePadding key={childId}>
                <NavLink to={route} style={styles.links.componentFull}>
                  <ListItemButton selected={isRouteMatching(route)} sx={item}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }}/>
          </Box>
        ))}
        <AccountCategory />
      </List>
    </Drawer>
  )
}

const AccountCategory = (): JSX.Element => {
  const location = useLocation()
  const authenticator = useContext(AuthenticatorContext)

  return <Box key={'Account'} sx={{ backgroundColor: '#101F33' }}>
    <ListItem sx={{ py: 2, px: 3 }}>
      <ListItemText sx={{ color: '#fff' }}>Account</ListItemText>
    </ListItem>
    <ListItem disablePadding>
      <NavLink to={'/profile'} style={styles.links.componentFull} >
        <ListItemButton selected={location.pathname === '/profile'} sx={item}>
          <ListItemIcon><AccountCircleOutlinedIcon/></ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </ListItemButton>
      </NavLink>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={() => { void authenticator.signOut() }} sx={item}>
        <ListItemIcon><LogoutOutlinedIcon/></ListItemIcon>
        <ListItemText>Sign out</ListItemText>
      </ListItemButton>
    </ListItem>
    <Divider sx={{ mt: 2 }}/>
  </Box>
}

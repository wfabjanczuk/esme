import * as React from 'react'
import { useContext } from 'react'
import Divider from '@mui/material/Divider'
import Drawer, { DrawerProps } from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { NavLink, useLocation } from 'react-router-dom'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { styles } from './styles'
import { useProfileDetails } from '../pages/profile/profile.hook'
import { ErrorView } from '../app/error.view'
import { defaultRoute, getUserCategories, MenuButton, MenuRoute } from './categories'
import { useAdminAgencyPreview } from '../pages/admin-agencies/agencies.hook'

export default function Menu (props: DrawerProps): JSX.Element {
  const authenticator = useContext(AuthenticatorContext)
  const {
    profile,
    errorMessages
  } = useProfileDetails()
  const { setAgency } = useAdminAgencyPreview()
  const { ...other } = props

  if (profile == null) {
    return <ErrorView errorMessages={errorMessages}/>
  }

  const leavePreview = (): void => setAgency(
    undefined,
    () => window.location.replace(`/admin/agencies/${profile.agencyId ?? ''}`)
  )

  const categories = getUserCategories(profile, authenticator, leavePreview)

  return (
    <Drawer variant='permanent' {...other}>
      <List disablePadding>
        <ListItem sx={{
          ...item,
          ...itemCategory,
          fontSize: 22,
          color: '#fff'
        }}>
          Emergency Service
        </ListItem>
        {categories.map(({
          id,
          children
        }) => (
          <Box key={id} sx={{ backgroundColor: '#101F33' }}>
            <ListItem sx={{
              py: 2,
              px: 3
            }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map((child) => <MenuItem key={child.id} child={child}/>)}
            <Divider sx={{ mt: 2 }}/>
          </Box>
        ))}
      </List>
    </Drawer>
  )
}

interface MenuItemProps {
  child: MenuRoute | MenuButton
}

const MenuItem = ({ child }: MenuItemProps): JSX.Element => {
  const location = useLocation()
  const isRouteMatching = (route: string): boolean => {
    if (location.pathname === '/') {
      return route === defaultRoute
    }
    return location.pathname.startsWith(route)
  }

  if (child.type === 'button') {
    return <ListItem disablePadding key={child.id}>
      <ListItemButton onClick={child.onClick} sx={item}>
        <ListItemIcon>{child.icon}</ListItemIcon>
        <ListItemText>{child.id}</ListItemText>
      </ListItemButton>
    </ListItem>
  }

  return <ListItem disablePadding key={child.id}>
    <NavLink to={child.route} style={styles.links.componentFull}>
      <ListItemButton selected={isRouteMatching(child.route)} sx={item}>
        <ListItemIcon>{child.icon}</ListItemIcon>
        <ListItemText>{child.id}</ListItemText>
      </ListItemButton>
    </NavLink>
  </ListItem>
}

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

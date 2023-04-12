import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import PeopleIcon from '@mui/icons-material/People'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import CellTowerIcon from '@mui/icons-material/CellTower'
import * as React from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { Authenticator } from '../common/authenticator/authenticator.context'
import { Profile, UserRole } from '../pages/profile/profile.entity'

export const defaultRoute = '/profile'

export const getUserCategories = (profile: Profile, authenticator: Authenticator): Category[] => {
  const isAdmin = [UserRole.superAdmin, UserRole.admin].includes(profile.role)
  const isAgency = profile.agencyId != null

  let categories = isAgency ? agencyCategories : adminCategories
  if (!isAdmin) {
    categories = [...categories, ...messengerCategories]
  }

  return [...categories, ...getAccountCategories(authenticator)]
}

export interface Category {
  id: string
  children: Array<MenuRoute | MenuButton>
}

export interface MenuRoute {
  type: 'route'
  id: string
  icon: React.ReactNode
  route: string
}

export interface MenuButton {
  type: 'button'
  id: string
  icon: React.ReactNode
  onClick: () => void
}

export const adminCategories: Category[] = [
  {
    id: 'Admin',
    children: [
      {
        type: 'route',
        id: 'Agencies',
        icon: <WorkOutlineIcon/>,
        route: '/admin/agencies'
      },
      {
        type: 'route',
        id: 'Administrators',
        icon: <PeopleIcon/>,
        route: '/admin/users'
      },
      {
        type: 'route',
        id: 'Changelogs',
        icon: <HistoryOutlinedIcon/>,
        route: '/admin/changelogs'
      }
    ]
  }
]

export const agencyCategories: Category[] = [
  {
    id: 'Organizer',
    children: [
      {
        type: 'route',
        id: 'Agency',
        icon: <WorkOutlineIcon/>,
        route: '/agency'
      },
      {
        type: 'route',
        id: 'Users',
        icon: <PeopleIcon/>,
        route: '/users'
      },
      {
        type: 'route',
        id: 'Events',
        icon: <StarOutlineIcon/>,
        route: '/events'
      },
      {
        type: 'route',
        id: 'Issues',
        icon: <AssignmentOutlinedIcon/>,
        route: '/issues'
      },
      {
        type: 'route',
        id: 'Changelogs',
        icon: <HistoryOutlinedIcon/>,
        route: '/changelogs'
      }
    ]
  }
]

export const messengerCategories: Category[] = [
  {
    id: 'Messenger',
    children: [
      {
        type: 'route',
        id: 'Live support',
        icon: <CellTowerIcon/>,
        route: '/support'
      }
    ]
  }
]

export const getAccountCategories = (authenticator: Authenticator): Category[] => {
  return [
    {
      id: 'Account',
      children: [
        {
          type: 'route',
          id: 'Profile',
          icon: <AccountCircleOutlinedIcon/>,
          route: defaultRoute
        },
        {
          type: 'button',
          id: 'Sign out',
          icon: <LogoutOutlinedIcon/>,
          onClick: () => {
            void authenticator.signOut()
          }
        }
      ]
    }
  ]
}

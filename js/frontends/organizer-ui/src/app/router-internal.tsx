import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorView } from './error.view'
import { PlaceholderView } from './placeholder-view'
import { Layout } from '../layout/layout'
import { EditAgencyView } from '../pages/agency/edit-agency.view'
import { SupportView } from '../pages/support/support.view'
import { EventsView } from '../pages/events/events.view'
import { EditEventView } from '../pages/events/edit-event.view'
import { CreateEventView } from '../pages/events/create-event.view'
import { UsersView } from '../pages/users/users.view'
import { CreateUserView } from '../pages/users/create-user.view'
import { EditUserView } from '../pages/users/edit-user.view'
import { ChangelogsView } from '../pages/changelogs/changelogs.view'
import { ChangelogDetailsView } from '../pages/changelogs/changelog-details.view'

export const RouterInternal = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    errorElement: <ErrorView/>,
    children: [
      {
        errorElement: <ErrorView/>,
        children: [
          {
            index: true,
            element: <EditAgencyView/>
          },
          {
            path: 'users',
            element: <UsersView/>
          },
          {
            path: 'users/add',
            element: <CreateUserView/>
          },
          {
            path: 'users/:id',
            element: <EditUserView/>
          },
          {
            path: 'events',
            element: <EventsView/>
          },
          {
            path: 'events/add',
            element: <CreateEventView/>
          },
          {
            path: 'events/:id',
            element: <EditEventView/>
          },
          {
            path: 'issues',
            element: <PlaceholderView text={'Issues'}/>
          },
          {
            path: 'changelogs',
            element: <ChangelogsView/>
          },
          {
            path: 'changelogs/:id',
            element: <ChangelogDetailsView/>
          },
          {
            path: 'support',
            element: <SupportView/>
          },
          {
            path: 'profile',
            element: <PlaceholderView text={'Profile'}/>
          },
          {
            path: 'error',
            element: <PlaceholderView text={'Error'}/>
          }
        ]
      }
    ]
  }
])

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
            element: <PlaceholderView text={'Users'}/>
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
            path: 'logs',
            element: <PlaceholderView text={'Logs'}/>
          },
          {
            path: 'logs',
            element: <PlaceholderView text={'Logs'}/>
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

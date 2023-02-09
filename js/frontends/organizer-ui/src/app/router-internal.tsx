import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorView } from './error.view'
import { PlaceholderView } from './placeholder-view'
import { Layout } from '../layout/layout'
import { AgencyView } from '../pages/agency/agency.view'

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
            element: <PlaceholderView text={'Index'}/>
          },
          {
            path: 'agency',
            element: <AgencyView/>
          },
          {
            path: 'users',
            element: <PlaceholderView text={'Users'}/>
          },
          {
            path: 'events',
            element: <PlaceholderView text={'Events'}/>
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
            element: <PlaceholderView text={'Live support'}/>
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

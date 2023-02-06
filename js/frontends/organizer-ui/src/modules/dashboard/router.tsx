import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorView } from '../root/error-view'
import { PlaceholderView } from '../root/placeholder-view'
import { Dashboard } from './dashboard'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard/>,
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
            element: <PlaceholderView text={'Agency'}/>
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
            path: 'sign-out',
            element: <PlaceholderView text={'Sign out'}/>
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

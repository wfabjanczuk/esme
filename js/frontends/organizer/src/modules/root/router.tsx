import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Root } from './root'
import { ErrorView } from './error-view'
import { PlaceholderView } from './placeholder-view'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
            path: 'users',
            element: <PlaceholderView text={'Users'}/>
          },
          {
            path: 'agencies',
            element: <PlaceholderView text={'Agencies'}/>
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
            path: 'error',
            element: <PlaceholderView text={'Error'}/>
          }
        ]
      }
    ]
  }
])

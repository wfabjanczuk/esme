import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { ErrorView } from './error.view'
import { SignInView } from '../pages/auth/sign-in.view'
import { SignUpView } from '../pages/auth/sign-up.view'

export const RouterExternal = createBrowserRouter([
  {
    path: '/',
    element: <Outlet/>,
    errorElement: <ErrorView/>,
    children: [
      {
        errorElement: <ErrorView/>,
        children: [
          {
            index: true,
            element: <SignInView />
          },
          {
            path: '/register',
            element: <SignUpView />
          }
        ]
      }
    ]
  }
])

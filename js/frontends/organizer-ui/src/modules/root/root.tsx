import React from 'react'
import { AuthenticatorContext } from '../auth/authenticator.context'
import { Router } from '../dashboard/router'
import { RouterProvider } from 'react-router-dom'
import { SignInView } from '../pages/sign-in/sign-in.view'
import { Theme } from './theme'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useNewAuthenticator } from '../auth/authenticator.hook'

export const Root = (): JSX.Element => {
  const authenticator = useNewAuthenticator()

  return <ThemeProvider theme={Theme}>
    <CssBaseline/>
    <AuthenticatorContext.Provider value={authenticator}>
      {authenticator.isAuthorized()
        ? <RouterProvider router={Router}/>
        : <SignInView/>
      }
    </AuthenticatorContext.Provider>
  </ThemeProvider>
}

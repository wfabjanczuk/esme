import React from 'react'
import { AuthenticatorContext } from '../pages/auth/authenticator.context'
import { RouterInternal } from './router-internal'
import { RouterProvider } from 'react-router-dom'
import { Theme } from '../layout/theme'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useNewAuthenticator } from '../pages/auth/authenticator.hook'
import { RouterExternal } from './router-external'

export const Root = (): JSX.Element => {
  const authenticator = useNewAuthenticator()
  if (!authenticator.isInitialized()) {
    return <></>
  }

  return <ThemeProvider theme={Theme}>
    <CssBaseline/>
    <AuthenticatorContext.Provider value={authenticator}>
      {authenticator.isAuthorized()
        ? <RouterProvider router={RouterInternal}/>
        : <RouterProvider router={RouterExternal}/>
      }
    </AuthenticatorContext.Provider>
  </ThemeProvider>
}

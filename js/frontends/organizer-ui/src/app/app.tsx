import React from 'react'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { RouterInternal } from './router-internal'
import { RouterProvider } from 'react-router-dom'
import { Theme } from '../layout/theme'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useNewAuthenticator } from '../common/authenticator/authenticator.hook'
import { RouterExternal } from './router-external'
import { useNewAlertStore } from '../common/alert-bar/alert-store.hook'
import { AlertStoreContext } from '../common/alert-bar/alert-store.context'
import { AlertBar } from '../common/alert-bar/alert-bar.component'

export const App = (): JSX.Element => {
  const authenticator = useNewAuthenticator()
  const alertStore = useNewAlertStore()

  if (!authenticator.hasState()) {
    return <></>
  }

  return <ThemeProvider theme={Theme}>
    <CssBaseline/>
    <AuthenticatorContext.Provider value={authenticator}>
      <AlertStoreContext.Provider value={alertStore}>
        <AlertBar/>
        {authenticator.isAuthorized()
          ? <RouterProvider router={RouterInternal}/>
          : <RouterProvider router={RouterExternal}/>
        }
      </AlertStoreContext.Provider>
    </AuthenticatorContext.Provider>
  </ThemeProvider>
}

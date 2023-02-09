import React from 'react'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { RouterInternal } from './router-internal'
import { RouterProvider } from 'react-router-dom'
import { Theme } from '../layout/theme'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { useNewAuthenticator } from '../common/authenticator/authenticator.hook'
import { RouterExternal } from './router-external'
import { useNewAlertBar } from '../common/flash/alert-bar.hook'
import { AlertBarContext } from '../common/flash/alert-bar.context'

export const App = (): JSX.Element => {
  const authenticator = useNewAuthenticator()
  const alertBar = useNewAlertBar()
  if (!authenticator.isInitialized() || !alertBar.isInitialized()) {
    return <></>
  }

  return <ThemeProvider theme={Theme}>
    <CssBaseline/>
    <AuthenticatorContext.Provider value={authenticator}>
      <AlertBarContext.Provider value={alertBar}>
        {authenticator.isAuthorized()
          ? <RouterProvider router={RouterInternal}/>
          : <RouterProvider router={RouterExternal}/>
        }
      </AlertBarContext.Provider>
    </AuthenticatorContext.Provider>
  </ThemeProvider>
}

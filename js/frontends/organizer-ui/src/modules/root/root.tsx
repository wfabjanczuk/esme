import React, { useState } from 'react'
import { CurrentUser, CurrentUserContext, InitialUser } from '../auth/current-user-context'
import { Router } from '../dashboard/router'
import { RouterProvider } from 'react-router-dom'
import { SignInView } from '../auth/sign-in-view'
import { Theme } from './theme'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'

export const Root = (): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(InitialUser)
  currentUser.setState = setCurrentUser

  return <ThemeProvider theme={Theme}>
    <CssBaseline/>
    <CurrentUserContext.Provider value={currentUser}>
      {currentUser.isAuthorized()
        ? <RouterProvider router={Router}/>
        : <SignInView/>
      }
    </CurrentUserContext.Provider>
  </ThemeProvider>
}

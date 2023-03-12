import React from 'react'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'
import { paperTheme } from './theme'
import { NavigationInternal } from './navigation/internal/navigation-internal'
import { MockContextProvider } from '../shared/services/mock/mock.context'
import { theme as globalTheme } from '../theme'
import { useNewAuthenticator } from '../common/authenticator/authenticator.hook'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { NavigationExternal } from './navigation/external/navigation-external'

export const App = (): JSX.Element => {
  const authenticator = useNewAuthenticator()

  if (!authenticator.hasState()) {
    return <></>
  }

  if (authenticator.isAuthorized()) {
    console.log('Authorized')
  } else {
    console.log('Not authorized')
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <PaperProvider theme={paperTheme}>
        <MockContextProvider>
          <AuthenticatorContext.Provider value={authenticator}>
            <StatusBar
              backgroundColor={globalTheme.colors.bg.primary}
              barStyle='dark-content'
            />
            {authenticator.isAuthorized()
              ? <NavigationInternal />
              : <NavigationExternal />
            }
          </AuthenticatorContext.Provider>
        </MockContextProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}

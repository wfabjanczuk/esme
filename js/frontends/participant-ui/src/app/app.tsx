import React from 'react'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'
import { paperTheme, theme as globalTheme } from '../layout'
import { NavigationInternal } from './navigation/navigation-internal'
import { MockContextProvider } from '../common/services/mock/mock.context'
import { useNewAuthenticator } from '../common/authenticator/authenticator.hook'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { NavigationExternal } from './navigation/navigation-external'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export const App = (): JSX.Element => {
  const authenticator = useNewAuthenticator()

  if (!authenticator.hasState()) {
    return <></>
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <PaperProvider theme={paperTheme} settings={{
        icon: props => <MaterialIcons {...props} />
      }}>
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

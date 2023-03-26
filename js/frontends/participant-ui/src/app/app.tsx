import React from 'react'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'
import { paperTheme, theme as globalTheme } from '../layout'
import { NavigationInternal } from './navigation/navigation-internal'
import { useNewAuthenticator } from '../common/authenticator/authenticator.hook'
import { AuthenticatorContext } from '../common/authenticator/authenticator.context'
import { NavigationExternal } from './navigation/navigation-external'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNewAlertStore } from '../common/alert-bar/alert-store.hook'
import { AlertStoreContext } from '../common/alert-bar/alert-store.context'
import { AlertBar } from '../common/alert-bar/alert-bar.component'

export const App = (): JSX.Element => {
  const authenticator = useNewAuthenticator()
  const alertStore = useNewAlertStore()

  if (!authenticator.hasState() || !alertStore.hasState()) {
    return <></>
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <PaperProvider theme={paperTheme} settings={{
        icon: props => <MaterialIcons {...props} />
      }}>
        <AuthenticatorContext.Provider value={authenticator}>
          <AlertStoreContext.Provider value={alertStore}>
            <StatusBar
              backgroundColor={globalTheme.colors.bg.primary}
              barStyle='dark-content'
            />
            <AlertBar/>
            {authenticator.isAuthorized()
              ? <NavigationInternal/>
              : <NavigationExternal/>
            }
          </AlertStoreContext.Provider>
        </AuthenticatorContext.Provider>
      </PaperProvider>
    </ThemeProvider>
  )
}

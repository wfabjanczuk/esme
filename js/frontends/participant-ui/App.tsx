import React from 'react'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'
import { paperTheme } from './App.styles'
import { Navigation } from './src/navigation'
import { MockContextProvider } from './src/shared/services/mock/mock.context'
import { theme as globalTheme } from './src/theme'

export const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={globalTheme}>
      <PaperProvider theme={paperTheme}>
        <MockContextProvider>
          <StatusBar
            backgroundColor={globalTheme.colors.bg.primary}
            barStyle='dark-content'
          />
          <Navigation />
        </MockContextProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}

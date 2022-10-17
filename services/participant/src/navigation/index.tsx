import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppNavigator } from './app.navigator'

export const Navigation = (): JSX.Element => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
)

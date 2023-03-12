import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getScreenOptions } from './styles'
import { NavigationContainer } from '@react-navigation/native'
import { SignInScreen } from '../../../modules/auth/screens/sign-in.screen'

const FrontStack = createNativeStackNavigator()

const ExternalNavigator = (): JSX.Element => (
  <FrontStack.Navigator screenOptions={getScreenOptions}>
    <FrontStack.Screen
      name='Authentication'
      component={SignInScreen}
    />
  </FrontStack.Navigator>
)

export const NavigationExternal = (): JSX.Element => (
  <NavigationContainer>
    <ExternalNavigator />
  </NavigationContainer>
)

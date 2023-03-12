import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { SignInScreen } from '../../modules/auth/sign-in.screen'
import { SignUpScreen } from '../../modules/auth/sign-up.screen'

const FrontStack = createNativeStackNavigator()

const ExternalNavigator = (): JSX.Element => (
  <FrontStack.Navigator>
    <FrontStack.Screen
      name='Authentication'
      component={SignInScreen}
      options={{ headerShown: false }}
    />
    <FrontStack.Screen
      name='Registration'
      component={SignUpScreen}
      options={{ headerShown: true }}
    />
  </FrontStack.Navigator>
)

export const NavigationExternal = (): JSX.Element => (
  <NavigationContainer>
    <ExternalNavigator />
  </NavigationContainer>
)

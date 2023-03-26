import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import { SignInScreen } from '../../modules/auth/sign-in.screen'
import { SignUpScreen } from '../../modules/auth/sign-up.screen'

export type FrontStackParamsList = ParamListBase

const FrontStack = createNativeStackNavigator<FrontStackParamsList>()

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
    <ExternalNavigator/>
  </NavigationContainer>
)

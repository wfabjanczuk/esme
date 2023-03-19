import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventSelectScreen } from '../../modules/events/event-select.screen'
import { ConversationScreen } from '../../modules/messages/screens/conversation.screen'
import { ThreadsScreen } from '../../modules/messages/screens/threads.screen'
import { SettingsScreen } from '../../modules/settings/screens/settings.screen'
import { getScreenOptions } from './styles'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import { EventDetailsScreen } from '../../modules/events/event-details.screen'

export type FrontStackParamsList = {
  'Main': undefined
  'Conversation': undefined
} & ParamListBase

export type EventStackParamsList = {
  'Event select': undefined
  'Event details': { id: number }
} & ParamListBase

export type BottomTabsParamsList = {
  'Messages': undefined
  'Help': undefined
  'Settings': undefined
} & ParamListBase

const FrontStack = createNativeStackNavigator<FrontStackParamsList>()
const EventStack = createNativeStackNavigator<EventStackParamsList>()
const BottomTabs = createBottomTabNavigator<BottomTabsParamsList>()

const MainNavigator = (): JSX.Element => (
  <BottomTabs.Navigator
    initialRouteName='Help'
    screenOptions={getScreenOptions}>
    <BottomTabs.Screen name='Messages' component={ThreadsScreen}/>
    <BottomTabs.Screen name='Help' component={HelpNavigator}/>
    <BottomTabs.Screen name='Settings' component={SettingsScreen}/>
  </BottomTabs.Navigator>
)

const HelpNavigator = (): JSX.Element => (
  <EventStack.Navigator screenOptions={getScreenOptions}>
    <EventStack.Screen name='Event select' component={EventSelectScreen}/>
    <EventStack.Screen
      name='Event details'
      component={EventDetailsScreen}
      options={{ headerShown: true }}
    />
  </EventStack.Navigator>
)

const InternalNavigator = (): JSX.Element => (
  <FrontStack.Navigator screenOptions={getScreenOptions}>
    <FrontStack.Screen name='Main' component={MainNavigator}/>
    <FrontStack.Screen
      name='Conversation'
      component={ConversationScreen}
      options={{ headerShown: true }}
    />
  </FrontStack.Navigator>
)

export const NavigationInternal = (): JSX.Element => (
  <NavigationContainer>
    <InternalNavigator/>
  </NavigationContainer>
)

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EventsScreen } from '../modules/events/screens/events.screen'
import { HelpScreen } from '../modules/help/screens/help.screen'
import { AnnouncementsScreen } from '../modules/messages/screens/announcements.screen'
import { ConversationScreen } from '../modules/messages/screens/conversation.screen'
import { ThreadsScreen } from '../modules/messages/screens/threads.screen'
import { SettingsScreen } from '../modules/settings/screens/settings.screen'
import { getScreenOptions } from './app.styles'

const FrontStack = createNativeStackNavigator()
const MainTabs = createBottomTabNavigator()

const MainNavigator = (): JSX.Element => (
  <MainTabs.Navigator
    initialRouteName='Events'
    screenOptions={getScreenOptions}>
    <MainTabs.Screen name='Help' component={HelpScreen} />
    <MainTabs.Screen name='Messages' component={ThreadsScreen} />
    <MainTabs.Screen name='Events' component={EventsScreen} />
    <MainTabs.Screen name='Settings' component={SettingsScreen} />
  </MainTabs.Navigator>
)

export const AppNavigator = (): JSX.Element => (
  <FrontStack.Navigator screenOptions={getScreenOptions}>
    <FrontStack.Screen name='Main' component={MainNavigator} />
    <FrontStack.Screen
      name='Conversation'
      component={ConversationScreen}
      options={{ headerShown: true }}
    />
    <FrontStack.Screen
      name='Announcements'
      component={AnnouncementsScreen}
      options={{ headerShown: true }}
    />
  </FrontStack.Navigator>
)

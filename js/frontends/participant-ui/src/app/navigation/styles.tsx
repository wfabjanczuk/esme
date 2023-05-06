import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { theme as globalTheme } from '../../layout'
import { RouteProp } from '@react-navigation/core/lib/typescript/src/types'
import { Platform } from 'react-native'

type routeName = keyof typeof icons

const isIos = Platform.OS === 'ios'

const icons = {
  Chats: 'chatbubble-ellipses',
  Help: 'medkit',
  Settings: 'settings'
}

const styles = {
  iconSize: 25,
  tabBarHeight: isIos ? 98 : 70,
  tabBarItemMargin: isIos ? 6 : 10,
  tabBarLabelFontSize: 10
}

const getIconName = (routeName: routeName, focused: boolean): string =>
  icons[routeName] + (focused ? '' : '-outline')

type tabIconGenerator = ({ focused, color }: { focused: boolean, color: string }) => JSX.Element

interface ScreenOptions {
  tabBarIcon: tabIconGenerator
  tabBarActiveTintColor: string
  tabBarInactiveTintColor: string
  headerShown: boolean
  tabBarStyle: object
  tabBarItemStyle: object
  tabBarLabelStyle: object
}

type screenOptionsGenerator = ({ route }: { route: RouteProp<Record<string, object | undefined>> }) => ScreenOptions

export const getScreenOptions: screenOptionsGenerator = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => (
    <Ionicons
      name={getIconName(route.name as routeName, focused)}
      size={styles.iconSize}
      color={color}
    />
  ),
  tabBarActiveTintColor: globalTheme.colors.brand.primary,
  tabBarInactiveTintColor: globalTheme.colors.ui.primary,
  headerShown: false,
  tabBarStyle: {
    height: styles.tabBarHeight,
    backgroundColor: globalTheme.colors.bg.primary
  },
  tabBarItemStyle: { margin: styles.tabBarItemMargin },
  tabBarLabelStyle: { fontSize: styles.tabBarLabelFontSize },
  tabBarLabel: route.name === 'Help' ? 'Request help' : route.name
})

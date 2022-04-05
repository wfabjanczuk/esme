import Ionicons from 'react-native-vector-icons/Ionicons';

import {theme as globalTheme} from '../theme';

const TAB_ICONS = {
  Help: 'medkit',
  Messages: 'chatbubble-ellipses',
  Events: 'musical-notes',
  Settings: 'settings',
};

const TAB_STYLES = {
  iconSize: 25,
  tabBarHeight: 56,
  tabBarItemMargin: 6,
  tabBarLabelFontSize: 10,
};

const getIconName = (routeName, focused) =>
  TAB_ICONS[routeName] + (focused ? '' : '-outline');

export const getScreenOptions = ({route}) => ({
  tabBarIcon: ({focused, color}) => (
    <Ionicons
      name={getIconName(route.name, focused)}
      size={TAB_STYLES.iconSize}
      color={color}
    />
  ),
  tabBarActiveTintColor: globalTheme.colors.brand.primary,
  tabBarInactiveTintColor: globalTheme.colors.ui.primary,
  headerShown: false,
  tabBarStyle: {
    height: TAB_STYLES.tabBarHeight,
    backgroundColor: globalTheme.colors.bg.primary,
  },
  tabBarItemStyle: {margin: TAB_STYLES.tabBarItemMargin},
  tabBarLabelStyle: {fontSize: TAB_STYLES.tabBarLabelFontSize},
});

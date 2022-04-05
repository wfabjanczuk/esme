import {NavigationContainer} from '@react-navigation/native';

import {AppNavigator} from './app.navigator';

export const Navigation = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

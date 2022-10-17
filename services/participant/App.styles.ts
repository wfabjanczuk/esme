import { DefaultTheme } from 'react-native-paper'

import { theme as globalTheme } from './src/theme'

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: globalTheme.colors.brand.primary,
    accent: globalTheme.colors.brand.secondary
  }
}

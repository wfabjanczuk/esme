import { colors } from './colors'
import { fontSizes } from './fonts'
import { sizes } from './sizes'
import { lineHeights, spaces } from './spacing'
import { DefaultTheme } from 'react-native-paper'

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}

type Theme = typeof theme

export const theme = {
  colors,
  spaces,
  lineHeights,
  sizes,
  fontSizes
}

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.brand.primary,
    accent: theme.colors.brand.secondary,
    background: 'white'
  }
}

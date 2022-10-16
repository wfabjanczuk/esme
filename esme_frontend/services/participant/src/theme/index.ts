import { colors } from './colors'
import { fontSizes } from './fonts'
import { sizes } from './sizes'
import { lineHeights, spaces } from './spacing'

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

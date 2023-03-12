import styled from 'styled-components/native'
import { PaperButton } from '../../../shared/components/overrides'
import { theme as globalTheme } from '../../../theme'

export const FormButton = styled(PaperButton).attrs({
  mode: 'contained',
  color: globalTheme.colors.brand.primary,
  contentStyle: { padding: 5 }
})`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

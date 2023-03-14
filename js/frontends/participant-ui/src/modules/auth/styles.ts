import styled from 'styled-components/native'
import { PaperButton, PaperTextInput } from '../../common/components/overrides'
import { theme as globalTheme } from '../../layout'

export const Form = styled.View`
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[0]};
`

export const ButtonGroup = styled.View`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[0]};
`

export const StyledTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const SignInButton = styled(PaperButton).attrs({
  mode: 'contained',
  buttonColor: globalTheme.colors.brand.primary,
  contentStyle: { padding: 5 }
})`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const RegisterButton = styled(PaperButton).attrs({
  mode: 'contained',
  buttonColor: globalTheme.colors.ui.success,
  contentStyle: { padding: 5 }
})`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const CancelButton = styled(PaperButton).attrs({
  mode: 'contained',
  buttonColor: globalTheme.colors.ui.error,
  contentStyle: { padding: 5 }
})`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

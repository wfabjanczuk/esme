import styled from 'styled-components/native'
import { PaperButton } from './overrides'
import { theme as globalTheme } from '../../layout'

type buttonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning'

const buttonStyle = (variant: buttonVariant): Object => ({
  mode: 'contained',
  buttonColor: variant === 'primary'
    ? globalTheme.colors.brand.primary
    : globalTheme.colors.ui[variant],
  contentStyle: { padding: 5 }
})

export const PrimaryButton = styled(PaperButton).attrs(buttonStyle('primary'))`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const SecondaryButton = styled(PaperButton).attrs(buttonStyle('secondary'))`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const SuccessButton = styled(PaperButton).attrs(buttonStyle('success'))`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const ErrorButton = styled(PaperButton).attrs(buttonStyle('error'))`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const WarningButton = styled(PaperButton).attrs(buttonStyle('warning'))`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

export const ButtonGroup = styled.View`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[0]};
`

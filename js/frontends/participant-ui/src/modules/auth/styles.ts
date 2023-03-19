import styled from 'styled-components/native'
import { PaperTextInput } from '../../common/components/overrides'

export const AuthForm = styled.View`
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[0]};
`

export const AuthButtonGroup = styled.View`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[0]};
`

export const AuthTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

import styled from 'styled-components/native'
import { PaperTextInput } from '../../common/components/overrides'

export const Form = styled.View`
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[0]};
`

export const ButtonGroup = styled.View`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[0]};
`

export const StyledTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

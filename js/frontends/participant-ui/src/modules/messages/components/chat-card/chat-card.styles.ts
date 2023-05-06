import styled from 'styled-components/native'
import { PaperListItem } from '../../../../common/components/overrides'

export const ChatCardContent = styled(PaperListItem)`
  padding-left: ${props => props.theme.spaces[2]};
  padding-right: ${props => props.theme.spaces[3]};
  margin-right: ${props => props.theme.spaces[1]};
`

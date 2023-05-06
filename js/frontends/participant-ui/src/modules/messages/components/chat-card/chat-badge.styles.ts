import styled from 'styled-components/native'
import { PaperBadge } from '../../../../common/components/overrides'

export const ChatBadgeContainer = styled.View`
  justify-content: center;
  align-content: center;
  margin-left: ${props => props.theme.spaces[3]};
`

export const ChatBadgeText = styled(PaperBadge)`
  background-color: ${props => props.theme.colors.ui.success};
  color: ${props => props.theme.colors.text.inverse};
  font-weight: bold;
  padding: 0 6px;
`

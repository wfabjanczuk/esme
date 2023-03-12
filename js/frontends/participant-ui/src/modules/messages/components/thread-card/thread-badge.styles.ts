import styled from 'styled-components/native'
import { PaperBadge } from '../../../../common/components/overrides'

export const ThreadBadgeContainer = styled.View`
  justify-content: center;
  align-content: center;
  margin-left: ${props => props.theme.spaces[3]};
`

export const ThreadBadgeText = styled(PaperBadge)`
  background-color: ${props => props.theme.colors.ui.warning};
  color: ${props => props.theme.colors.text.primary};
  font-weight: bold;
  padding: 0 6px;
`

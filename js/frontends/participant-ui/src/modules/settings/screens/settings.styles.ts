import styled from 'styled-components/native'
import { colors } from '../../../layout/colors'
import { PaperAvatarIcon, PaperListIcon, PaperListItem } from '../../../common/components/overrides'

export const AvatarContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spaces[4]};
`

export const AvatarPlaceholder = styled(PaperAvatarIcon).attrs({
  size: 180,
  icon: 'person',
  backgroundColor: colors.brand.primary
})``

export const SettingsItem = styled(PaperListItem)`
  padding: ${props => props.theme.spaces[3]};
`

export const SettingsItemIcon = styled(PaperListIcon).attrs({
  color: colors.text.primary
})``

import {View} from 'react-native';
import {Avatar, List} from 'react-native-paper';
import styled from 'styled-components/native';

import {colors} from '../../../theme/colors';

export const AvatarContainer = styled(View)`
  align-items: center;
  padding: ${props => props.theme.spaces[4]};
`;

export const AvatarPlaceholder = styled(Avatar.Icon).attrs({
  size: 180,
  icon: 'account',
  backgroundColor: colors.brand.primary,
})``;

export const SettingsItem = styled(List.Item)`
  padding: ${props => props.theme.spaces[3]};
`;

export const SettingsItemIcon = styled(List.Icon).attrs({
  color: colors.text.primary,
})``;

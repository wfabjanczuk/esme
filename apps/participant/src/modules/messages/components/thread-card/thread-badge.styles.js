import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import styled from 'styled-components/native';

export const ThreadBadgeContainer = styled(View)`
  justify-content: center;
  align-content: center;
  margin-left: ${props => props.theme.spaces[3]};
`;

export const ThreadBadgeText = styled(Badge)`
  background-color: ${props => props.theme.colors.ui.warning};
  color: ${props => props.theme.colors.text.primary};
  font-weight: bold;
  padding: 0 6px;
`;

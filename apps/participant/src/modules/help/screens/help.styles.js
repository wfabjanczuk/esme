import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import styled from 'styled-components/native';

import {theme as globalTheme} from '../../../theme';

export const HelpFormButton = styled(Button).attrs({
  mode: 'contained',
  color: globalTheme.colors.brand.primary,
  contentStyle: {padding: 5},
})`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`;

export const HelpFormInput = styled(TextInput)`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`;

export const HelpFormCheckboxInputContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`;

import {List} from 'react-native-paper';
import styled from 'styled-components/native';

export const ThreadCardContent = styled(List.Item)`
  padding-left: ${props => props.theme.spaces[2]};
  padding-right: ${props => props.theme.spaces[3]};
  margin-right: ${props => props.theme.spaces[1]};
`;

import {View} from 'react-native';
import styled from 'styled-components/native';

export const ThreadCardIconContainer = styled(View).attrs({
  pointerEvents: 'box-none',
})`
  margin: 8px;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
`;

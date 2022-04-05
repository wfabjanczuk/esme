import {View} from 'react-native';
import styled from 'styled-components/native';

export const ChatBubbleView = styled(View)`
  background-color: ${props => props.theme.colors.brand.primary};
  margin: 0 ${props => props.theme.spaces[2]};
  padding: ${props => props.theme.spaces[2]};
  border-radius: ${props => props.theme.sizes[0]};
  ${({variant}) => variant};
`;

const marginVariants = {
  own: 'margin-left',
  theirs: 'margin-right',
};

const backgroundVariants = {
  own: 'primary',
  theirs: 'muted',
};

export const getBubbleVariant = (isOwn, theme) => {
  const type = isOwn ? 'own' : 'theirs';

  return `
  ${marginVariants[type]}: ${theme.spaces[5]};
  background-color: ${theme.colors.brand[backgroundVariants[type]]};
 `;
};

import React from 'react';
import {View} from 'react-native';
import styled, {useTheme} from 'styled-components/native';

const sizeVariants = {
  small: 1,
  medium: 2,
  large: 3,
  extraLarge: 4,
};

const positionVariants = {
  top: 'margin-top',
  left: 'margin-left',
  bottom: 'margin-bottom',
  right: 'margin-right',
};

const getVariant = (position, size, theme) =>
  `${positionVariants[position]}: ${theme.spaces[sizeVariants[size]]};`;

const SpacerView = styled(View)`
  ${({variant}) => variant};
`;

export const Spacer = ({position, size, children}) => {
  const theme = useTheme(),
    variant = getVariant(position, size, theme);

  return <SpacerView variant={variant}>{children}</SpacerView>;
};

Spacer.defaultProps = {
  position: 'top',
  size: 'small',
};

import React from 'react'
import styled, { useTheme, DefaultTheme } from 'styled-components/native'

type sizeKey = keyof typeof sizeVariants

const sizeVariants = {
  small: 1,
  medium: 2,
  large: 3,
  extraLarge: 4
}

type positionKey = keyof typeof positionVariants

const positionVariants = {
  top: 'margin-top',
  right: 'margin-right',
  bottom: 'margin-bottom',
  left: 'margin-left',
  horizontal: 'margin-horizontal',
  vertical: 'margin-vertical',
  all: 'margin'
}

const getVariant = (
  position: positionKey,
  size: sizeKey,
  theme: DefaultTheme
): string => `${positionVariants[position]}: ${theme.spaces[sizeVariants[size]]};`

const SpacerView = styled.View<{ variant?: string }>`
  ${({ variant }) => variant};
`

interface SpacerProps {
  position: positionKey
  size: sizeKey
  children?: React.ReactNode
}

export const Spacer = ({ position, size, children }: SpacerProps): JSX.Element => {
  const theme = useTheme()
  const variant = getVariant(position, size, theme)

  return <SpacerView variant={variant}>{children}</SpacerView>
}

Spacer.defaultProps = {
  position: 'top',
  size: 'small'
}

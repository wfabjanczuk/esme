import styled, { DefaultTheme } from 'styled-components/native'

export const ChatBubbleView = styled.View<{ variant: string }>`
  background-color: ${props => props.theme.colors.brand.primary};
  margin: 0 ${props => props.theme.spaces[2]};
  padding: ${props => props.theme.spaces[2]};
  border-radius: ${props => props.theme.sizes[0]};
  ${({ variant }) => variant};
`

export const getBubbleVariant = (isOwn: boolean, theme: DefaultTheme): string => {
  const margin = isOwn ? 'margin-left' : 'margin-right'
  const brandKey = isOwn ? 'primary' : 'muted'

  return `
  ${margin}: ${theme.spaces[5]};
  background-color: ${theme.colors.brand[brandKey]};
 `
}

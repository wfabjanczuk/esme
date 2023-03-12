import styled, { DefaultTheme } from 'styled-components/native'

type textStyleProvider = (theme: DefaultTheme) => string

const getDefaultTextStyle: textStyleProvider = theme => `
  font-size: ${theme.fontSizes.body};
  color: ${theme.colors.text.primary};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`

const body: textStyleProvider = theme => ''

const activeBody: textStyleProvider = theme => `
  ${body(theme)}
  font-weight: bold;
`

const inverseBody: textStyleProvider = theme => `
  ${body(theme)}
  color: ${theme.colors.text.inverse};
`

const caption: textStyleProvider = theme => `
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.caption};
`

const activeCaption: textStyleProvider = theme => `
  ${caption(theme)}
  color: ${theme.colors.text.primary};
  font-weight: bold;
`

const placeholder: textStyleProvider = theme => `
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-style: italic;
`

const checkboxLabel: textStyleProvider = theme => `
  margin: ${theme.spaces[2]};
  margin-left: ${theme.spaces[2]};
`

const title: textStyleProvider = theme => `
  text-align: center;
  font-size: ${theme.fontSizes.title};
  font-weight: bold;
  margin: ${theme.spaces[3]} 0;
`

const error: textStyleProvider = theme => `
  color: ${theme.colors.text.error};
`

type variantKey = keyof typeof variants

const variants = {
  body,
  activeBody,
  inverseBody,
  caption,
  activeCaption,
  placeholder,
  checkboxLabel,
  title,
  error
}

interface StyledTextProps {
  theme: DefaultTheme
  variant?: variantKey
}

export const StyledText = styled.Text<StyledTextProps>`
  ${({ theme }) => getDefaultTextStyle(theme)}
  ${({ variant, theme }) => variants[variant !== undefined ? variant : 'body'](theme)}
`

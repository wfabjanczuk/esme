import {Text} from 'react-native';
import styled from 'styled-components/native';

const getDefaultTextStyle = theme => `
  font-size: ${theme.fontSizes.body};
  color: ${theme.colors.text.primary};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const body = theme => ``;

const activeBody = theme => `
  ${body(theme)}
  font-weight: bold;
`;

const inverseBody = theme => `
  ${body(theme)}
  color: ${theme.colors.text.inverse};
`;

const caption = theme => `
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSizes.caption};
`;

const activeCaption = theme => `
  ${caption(theme)}
  color: ${theme.colors.text.primary};
  font-weight: bold;
`;

const placeholder = theme => `
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-style: italic;
`;

const checkboxLabel = theme => `
  margin: ${theme.spaces[2]};
  margin-left: ${theme.spaces[3]};
`;

const title = theme => `
  text-align: center;
  font-size: ${theme.fontSizes.title};
  font-weight: bold;
  margin: ${theme.spaces[3]} 0;
`;

const variants = {
  body,
  activeBody,
  inverseBody,
  caption,
  activeCaption,
  placeholder,
  checkboxLabel,
  title,
};

export const StyledText = styled(Text)`
  ${({theme}) => getDefaultTextStyle(theme)}
  ${({variant, theme}) => variants[variant](theme)}
`;

StyledText.defaultProps = {
  variant: 'body',
};

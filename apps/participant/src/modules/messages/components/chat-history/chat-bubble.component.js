import React from 'react';
import {useTheme} from 'styled-components/native';

import {StyledText} from '../../../../shared/components/typography/styled-text.component';
import {ChatBubbleView, getBubbleVariant} from './chat-bubble.styles';

export const ChatBubble = ({isOwn, content}) => {
  const theme = useTheme(),
    bubbleVariant = getBubbleVariant(isOwn, theme),
    textVariant = isOwn ? 'inverseBody' : 'body';

  return (
    <ChatBubbleView variant={bubbleVariant}>
      <StyledText variant={textVariant}>{content}</StyledText>
    </ChatBubbleView>
  );
};

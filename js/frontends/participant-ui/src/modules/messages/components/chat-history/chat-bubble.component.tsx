import React from 'react'
import { useTheme } from 'styled-components/native'

import { StyledText } from '../../../../common/components/typography/styled-text.component'
import { ChatBubbleView, getBubbleVariant } from './chat-bubble.styles'

interface ChatBubbleProps {
  isOwn: boolean
  content: string
}

export const ChatBubble = ({ isOwn, content }: ChatBubbleProps): JSX.Element => {
  const theme = useTheme()
  const bubbleVariant = getBubbleVariant(isOwn, theme)
  const textVariant = isOwn ? 'inverseBody' : 'body'

  return (
    <ChatBubbleView variant={bubbleVariant}>
      <StyledText variant={textVariant}>{content}</StyledText>
    </ChatBubbleView>
  )
}

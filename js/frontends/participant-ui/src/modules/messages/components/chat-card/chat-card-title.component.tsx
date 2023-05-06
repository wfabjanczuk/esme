import React from 'react'
import { StyledText } from '../../../../common/components/typography/styled-text.component'

interface ChatCardTitleProps {
  eventName: string
  isEnded: boolean
}

export const ChatCardTitle = ({ eventName, isEnded }: ChatCardTitleProps): JSX.Element => {
  const textVariant = isEnded ? 'body' : 'activeBody'

  return (
    <StyledText variant={textVariant} numberOfLines={1}>
      {eventName}
    </StyledText>
  )
}

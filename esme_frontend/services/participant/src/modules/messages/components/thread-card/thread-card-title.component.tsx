import React from 'react'
import { StyledText } from '../../../../shared/components/typography/styled-text.component'

interface ThreadCardTitleProps {
  eventName: string
  unread: boolean
}

export const ThreadCardTitle = ({ eventName, unread }: ThreadCardTitleProps): JSX.Element => {
  const textVariant = unread ? 'activeBody' : 'body'

  return (
    <StyledText variant={textVariant} numberOfLines={1}>
      {eventName}
    </StyledText>
  )
}

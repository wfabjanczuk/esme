import React from 'react'
import { format } from 'date-fns'
import { StyledText } from '../../../../common/components/typography/styled-text.component'

const formatChatTimeStart = (timeStart: Date): string => {
  const today = new Date()

  if (today.toDateString() === timeStart.toDateString()) {
    return format(timeStart, 'HH:mm')
  }

  if (today.getFullYear() === timeStart.getFullYear()) {
    return format(timeStart, 'MMMM i')
  }

  return format(timeStart, 'MMMM i, yyyy')
}

interface ChatDescriptionProps {
  timeStart: Date
  isEnded: boolean
}

export const ChatDescription = ({ timeStart, isEnded }: ChatDescriptionProps): JSX.Element => {
  const textVariant = isEnded ? 'caption' : 'activeCaption'

  return (
    <StyledText variant={textVariant}>
      {formatChatTimeStart(timeStart)}
    </StyledText>
  )
}

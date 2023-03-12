import React from 'react'
import { format } from 'date-fns'
import { StyledText } from '../../../../common/components/typography/styled-text.component'

const formatThreadDateLastUpdated = (date: Date): string => {
  const today = new Date()

  if (today.toDateString() === date.toDateString()) {
    return format(date, 'HH:mm')
  }

  if (today.getFullYear() === date.getFullYear()) {
    return format(date, 'MMMM i')
  }

  return format(date, 'MMMM i, yyyy')
}

interface ThreadDescriptionProps {
  date: Date
  unread: boolean
}

export const ThreadDescription = ({ date, unread }: ThreadDescriptionProps): JSX.Element => {
  const textVariant = unread ? 'activeCaption' : 'caption'

  return (
    <StyledText variant={textVariant}>
      {formatThreadDateLastUpdated(date)}
    </StyledText>
  )
}

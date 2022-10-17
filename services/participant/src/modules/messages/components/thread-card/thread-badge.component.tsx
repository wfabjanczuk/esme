import React from 'react'
import { ThreadBadgeText, ThreadBadgeContainer } from './thread-badge.styles'

interface ThreadBadgeProps {
  content: string
}

export const ThreadBadge = ({ content }: ThreadBadgeProps): JSX.Element => (
  <ThreadBadgeContainer>
    <ThreadBadgeText>{content}</ThreadBadgeText>
  </ThreadBadgeContainer>
)

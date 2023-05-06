import React from 'react'
import { ChatBadgeText, ChatBadgeContainer } from './chat-badge.styles'

export const ActiveChatBadge = (): JSX.Element => (
  <ChatBadgeContainer>
    <ChatBadgeText>{'ACTIVE'}</ChatBadgeText>
  </ChatBadgeContainer>
)

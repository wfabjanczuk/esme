import React from 'react'
import { Message } from '../../../../common/messenger/structures'
import { Box } from '@mui/material'
import { getChatBubbleStyle } from './chat-bubble.styles'

interface ChatBubbleProps {
  message: Message
}

export const ChatBubble = ({ message }: ChatBubbleProps): JSX.Element => {
  return <Box sx={getChatBubbleStyle(message.fromOrganizer === 1)}>
    {message.content}
  </Box>
}

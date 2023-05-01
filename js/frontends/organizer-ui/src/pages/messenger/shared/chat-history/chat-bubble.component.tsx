import React from 'react'
import { Message } from '../../../../common/messenger/structures'
import { Box, Typography } from '@mui/material'
import { getChatBubbleContainerStyle, getChatBubbleStyle } from './chat-bubble.styles'
import { parseDateTimeChatLabel } from '../../../../common/utils'

interface ChatBubbleProps {
  message: Message
}

export const ChatBubble = ({ message }: ChatBubbleProps): JSX.Element => {
  const timeSent = parseDateTimeChatLabel(message.timeSent)
  const isOrganizer = message.fromOrganizer === 1

  return <Box sx={getChatBubbleContainerStyle(isOrganizer)}>
    <Typography variant='caption'>{timeSent}</Typography>
    <Box sx={getChatBubbleStyle(isOrganizer)}>
      {message.content}
    </Box>
  </Box>
}

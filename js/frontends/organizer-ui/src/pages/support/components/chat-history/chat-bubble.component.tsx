import React from 'react'
import { Message } from '../../../../common/messenger/structures'
import { Box, Typography } from '@mui/material'
import { getChatBubbleContainerStyle, getChatBubbleStyle } from './chat-bubble.styles'
import Tooltip from '@mui/material/Tooltip'

interface ChatBubbleProps {
  message: Message
}

export const ChatBubble = ({ message }: ChatBubbleProps): JSX.Element => {
  const timeSent = new Date(message.timeSent).toUTCString()
  const isOrganizer = message.fromOrganizer === 1
  const label = isOrganizer ? 'You' : 'Participant'
  const tooltipPlacement = isOrganizer ? 'left' : 'right'

  return <Box sx={getChatBubbleContainerStyle(isOrganizer)}>
    <Typography variant='caption'>{timeSent}</Typography>
    <Tooltip title={label} placement={tooltipPlacement} arrow>
      <Box sx={getChatBubbleStyle(isOrganizer)}>
        {message.content}
      </Box>
    </Tooltip>
  </Box>
}

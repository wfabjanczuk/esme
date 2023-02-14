import { Box } from '@mui/material'
import React from 'react'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../common/messenger/structures'

interface MessagesProps {
  messages: Message[]
}

export const ChatHistory = ({ messages }: MessagesProps): JSX.Element => {
  return <Box sx={{ overflow: 'auto', px: 1 }}>
    {messages.map((msg) => (
      <ChatBubble key={`${msg.chatId}_${msg.id}`} message={msg}/>
    ))}
  </Box>
}

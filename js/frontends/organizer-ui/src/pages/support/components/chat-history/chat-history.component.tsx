import { Box } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../common/messenger/structures'

interface MessagesProps {
  messages: Message[]
}

export const ChatHistory = ({ messages }: MessagesProps): JSX.Element => {
  const chatHistoryRef = useRef<HTMLDivElement>(null)
  const handleResize = (): void => {
    if (chatHistoryRef.current !== null) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }

  useEffect(handleResize, [chatHistoryRef.current, messages])
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <Box ref={chatHistoryRef}
    sx={{
      overflow: 'auto',
      px: 1
    }}>
    {messages.map((msg) => (
      <ChatBubble key={`${msg.chatId}_${msg.id}`} message={msg}/>
    ))}
  </Box>
}

import { Box } from '@mui/material'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../common/messenger/structures'

interface MessagesProps {
  messages: Message[]
}

export const ChatHistory = ({ messages }: MessagesProps): JSX.Element => {
  const chatHistoryRef = useRef<HTMLDivElement>(null)
  const [clientHeight, setClientHeight] = useState<number>(0)
  const scrollToBottom = (): void => {
    if (chatHistoryRef.current !== null) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }

  useLayoutEffect(() => {
    if (chatHistoryRef.current !== null) {
      setClientHeight(chatHistoryRef.current.clientHeight)
    }
  }, [chatHistoryRef.current])
  useEffect(scrollToBottom, [clientHeight, messages])
  useEffect(() => {
    window.addEventListener('resize', scrollToBottom)
    return () => window.removeEventListener('resize', scrollToBottom)
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

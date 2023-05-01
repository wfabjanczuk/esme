import React from 'react'
import { ChatHistory } from '../components/chat-history/chat-history.component'
import { Box } from '@mui/material'
import { useChatMessagesList } from './chat-messages-list.hook'

interface MessagesProps {
  activeChatId: string
}

export const Messages = ({ activeChatId }: MessagesProps): JSX.Element => {
  const { messages } = useChatMessagesList(activeChatId)

  return <Box sx={{
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <ChatHistory messages={messages}/>
  </Box>
}

import React, { useContext } from 'react'
import { ChatHistory } from './chat-history/chat-history.component'
import { ChatInput } from './chat-input/chat-input.component'
import { Box } from '@mui/material'
import { InboxContext } from '../../../common/messenger/inbox.context'

interface ConversationProps {
  chatId: string
}

export const Conversation = ({ chatId }: ConversationProps): JSX.Element => {
  const { messages } = useContext(InboxContext)

  if (messages[chatId] === undefined) {
    return <Box sx={{ flexGrow: 1 }}></Box>
  }

  return <Box sx={{
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <ChatHistory messages={messages[chatId]}/>
    <ChatInput chatId={chatId}/>
  </Box>
}

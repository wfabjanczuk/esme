import { Box } from '@mui/material'
import React, { useContext } from 'react'
import { InboxContext } from '../../common/messenger/inbox.context'
import { ChatBubble } from './components/chat-history/chat-bubble.component'

interface MessagesProps {
  chatId: string
}

export const Conversation = ({ chatId }: MessagesProps): JSX.Element => {
  const { messages } = useContext(InboxContext)

  if (messages[chatId] === undefined) {
    return <></>
  }

  return <Box sx={{ width: '60%' }}>
    {chatId !== ''
      ? messages[chatId]?.map((msg) => (
        <ChatBubble key={`${chatId}_${msg.id}`} message={msg} />
      ))
      : <></>
    }
  </Box>
}

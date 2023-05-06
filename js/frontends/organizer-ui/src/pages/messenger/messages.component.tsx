import React, { useContext } from 'react'
import { ChatHistory } from './shared/chat-history/chat-history.component'
import { ChatInput } from './shared/chat-input/chat-input.component'
import { Box } from '@mui/material'
import { InboxContext } from '../../common/messenger/inbox.context'
import { styles } from '../../layout/styles'

interface MessagesProps {
  activeChatId: string
}

export const Messages = ({ activeChatId }: MessagesProps): JSX.Element => {
  const { messages } = useContext(InboxContext)
  const chatMessages = messages.get(activeChatId)

  if (activeChatId === '' || chatMessages === undefined) {
    return <Box sx={{ flexGrow: 1 }}></Box>
  }

  return <Box sx={styles.messenger.messages}>
    <ChatHistory messages={chatMessages}/>
    <ChatInput chatId={activeChatId}/>
  </Box>
}

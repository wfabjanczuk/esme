import React, { useContext } from 'react'
import { ChatHistory } from './chat-history/chat-history.component'
import { ChatInput } from './chat-input/chat-input.component'
import { Box } from '@mui/material'
import { InboxContext } from '../../../common/messenger/inbox.context'
import { styles } from '../../../layout/styles'

interface ConversationProps {
  activeChatId: string
}

export const Conversation = ({ activeChatId }: ConversationProps): JSX.Element => {
  const { messages } = useContext(InboxContext)

  if (activeChatId === '' || messages[activeChatId] === undefined) {
    return <Box sx={{ flexGrow: 1 }}></Box>
  }

  return <Box sx={styles.messenger.messages}>
    <ChatHistory messages={messages[activeChatId]}/>
    <ChatInput chatId={activeChatId}/>
  </Box>
}

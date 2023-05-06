import React, { useContext, useEffect } from 'react'
import { ChatHistory } from '../shared/chat-history/chat-history.component'
import { Box } from '@mui/material'
import { ArchivesContext } from './archives.context'
import { styles } from '../../../layout/styles'

interface ArchivesMessagesProps {
  activeChatId: string
}

export const ArchivesMessages = ({ activeChatId }: ArchivesMessagesProps): JSX.Element => {
  const archives = useContext(ArchivesContext)
  const chatMessages = archives.messages[activeChatId]

  useEffect(() => {
    if (activeChatId !== '') {
      archives.fetchChatMessages(activeChatId)
    }
  }, [activeChatId])

  if (activeChatId === '' || chatMessages === undefined) {
    return <Box sx={{ flexGrow: 1 }}></Box>
  }

  return <Box sx={styles.messenger.messages}>
    <ChatHistory messages={chatMessages}/>
  </Box>
}

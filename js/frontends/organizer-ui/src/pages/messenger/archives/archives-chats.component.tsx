import React, { useContext } from 'react'
import { Box } from '@mui/material'
import List from '@mui/material/List'
import { ChatLabel } from '../shared/chat-label/chat-label.component'
import { ArchivesContext } from './archives.context'
import { styles } from '../../../layout/styles'

interface ArchivesChatsProps {
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const ArchivesChats = ({
  activeChatId,
  setActiveChatId
}: ArchivesChatsProps): JSX.Element => {
  const { chats } = useContext(ArchivesContext)

  return <Box sx={styles.messenger.chats}>
    <List disablePadding>
      {Object.entries(chats).map(([id, chat]) => (
        <ChatLabel
          key={`chats_${id}`}
          chat={chat}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      ))}
    </List>
  </Box>
}

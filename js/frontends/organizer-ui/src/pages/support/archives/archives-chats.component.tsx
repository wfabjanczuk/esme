import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { ChatLabel } from '../components/chat-label/chat-label.component'
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
      <ListItem>
        <Typography variant='h6' component='div'>Ended chats</Typography>
      </ListItem>
      <Divider/>
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

import React from 'react'
import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { ChatLabel } from '../components/chat-label/chat-label.component'
import { Chat } from '../../../common/messenger/structures'

interface ArchivedChatsProps {
  chats: Chat[]
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const ArchivedChats = ({
  chats,
  activeChatId,
  setActiveChatId
}: ArchivedChatsProps): JSX.Element => {
  return <Box sx={{
    minWidth: '400px',
    backgroundColor: '#eaeff1'
  }}>
    <List disablePadding>
      <ListItem style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant='h6' component='div'>Ended chats</Typography>
      </ListItem>
      <Divider/>
      {chats.map((chat) => (
        <ChatLabel
          key={`chats_${chat.id}`}
          chat={chat}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      ))}
    </List>
  </Box>
}

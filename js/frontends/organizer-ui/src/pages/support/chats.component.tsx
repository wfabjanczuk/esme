import React, { useContext } from 'react'
import { InboxContext } from '../../common/messenger/inbox.context'
import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'

interface ChatsProps {
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const Chats = ({
  activeChatId,
  setActiveChatId
}: ChatsProps): JSX.Element => {
  const { chats } = useContext(InboxContext)

  return <Box sx={{
    width: '400px',
    backgroundColor: '#eaeff1'
  }}>
    <List disablePadding>
      <ListItem>
        <Typography variant='h6' component='div'>Chats</Typography>
      </ListItem>
      <Divider/>
      {chats.map((chat) => (
        <ListItem key={`chat_${chat.id}`} disablePadding>
          <ListItemButton
            className={'light'}
            selected={activeChatId === chat.id}
            onClick={() => setActiveChatId(chat.id)}
          >
            {chat.id}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
}

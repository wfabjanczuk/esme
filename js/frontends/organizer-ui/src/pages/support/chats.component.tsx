import React, { useContext } from 'react'
import { InboxContext } from '../../common/messenger/inbox.context'
import { Box, Button, Typography } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { ChatLabel } from './components/chat-label/chat-label.component'
import { styles } from '../../layout/styles'
import { Start } from '@mui/icons-material'
import { MessengerContext } from '../../common/messenger/messenger.context'

interface ChatsProps {
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const Chats = ({
  activeChatId,
  setActiveChatId
}: ChatsProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const { chats } = useContext(InboxContext)

  return <Box sx={{
    width: '400px',
    backgroundColor: '#eaeff1'
  }}>
    <List disablePadding>
      <ListItem style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant='h6' component='div'>Chats</Typography>
        <Button type='submit' variant='contained' color='success' sx={styles.buttons.single}
          startIcon={<Start/>} onClick={() => messenger.startChat()}
        >
          Start next chat
        </Button>
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

import React, { useContext } from 'react'
import { InboxContext } from '../../common/messenger/inbox.context'
import { Box } from '@mui/material'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { ChatLabel } from './shared/chat-label/chat-label.component'
import { styles } from '../../layout/styles'
import { ChatStarter } from './chat-starter.component'

interface ChatsProps {
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const Chats = ({
  activeChatId,
  setActiveChatId
}: ChatsProps): JSX.Element => {
  const { chats } = useContext(InboxContext)

  return <Box sx={styles.messenger.chats}>
    <List disablePadding>
      <ChatStarter/>
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

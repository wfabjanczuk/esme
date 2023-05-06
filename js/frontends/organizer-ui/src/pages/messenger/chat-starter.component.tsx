import { styles } from '../../layout/styles'
import { CircularProgress, FormControlLabel, Switch } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import React, { useContext } from 'react'
import { ChatStarterContext } from '../../common/messenger/chat-starter.context'

export const ChatStarter = (): JSX.Element => {
  const {
    isWaitingForNewChat,
    setIsWaitingForNewChat
  } = useContext(ChatStarterContext)

  return <ListItem style={styles.messenger.chatsHeader}>
    <FormControlLabel
      control={<Switch
        checked={isWaitingForNewChat}
        onChange={e => {
          setIsWaitingForNewChat(e.target.checked)
        }}
      />}
      label={isWaitingForNewChat ? 'Waiting for new chat' : 'Not accepting new chats'}
    />
    {isWaitingForNewChat ? <CircularProgress size={25}/> : null}
  </ListItem>
}

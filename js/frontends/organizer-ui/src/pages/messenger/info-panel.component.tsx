import React from 'react'
import { Chat } from '../../common/messenger/structures'
import { Box, Divider } from '@mui/material'
import { ParticipantInfo } from './shared/info-panel/participant-info.component'
import { EventInfo } from './shared/info-panel/event-info.component'
import { styles } from '../../layout/styles'
import { ChatCloser } from './chat-closer.component'

interface InfoPanelProps {
  activeChat?: Chat
}

export const InfoPanel = ({ activeChat }: InfoPanelProps): JSX.Element => {
  if (activeChat === undefined) {
    return <></>
  }

  return <Box sx={styles.messenger.infoPanel}>
    <ChatCloser activeChatId={activeChat.id}/>
    <Divider/>
    <ParticipantInfo activeChat={activeChat}/>
    <EventInfo eventId={activeChat.eventId}/>
  </Box>
}

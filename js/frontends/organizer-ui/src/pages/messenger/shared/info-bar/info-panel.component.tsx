import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import { Box } from '@mui/material'
import { ParticipantInfo } from './participant-info.component'
import { EventInfo } from './event-info.component'
import { styles } from '../../../../layout/styles'

interface InfoPanelProps {
  activeChat?: Chat
}

export const InfoPanel = ({ activeChat }: InfoPanelProps): JSX.Element => {
  if (activeChat === undefined) {
    return <></>
  }

  return <Box sx={styles.messenger.infoPanel}>
    <ParticipantInfo activeChat={activeChat}/>
    <EventInfo eventId={activeChat.eventId}/>
  </Box>
}

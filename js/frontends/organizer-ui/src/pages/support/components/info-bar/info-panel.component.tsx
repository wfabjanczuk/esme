import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import { Box } from '@mui/material'
import { ParticipantInfo } from './participant-info.component'
import { EventInfo } from './event-info.component'

interface InfoPanelProps {
  activeChat?: Chat
}

export const InfoPanel = ({ activeChat }: InfoPanelProps): JSX.Element => {
  if (activeChat === undefined) {
    return <></>
  }

  return <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#eaeff1'
  }}>
    <ParticipantInfo activeChat={activeChat}/>
    <EventInfo eventId={activeChat.eventId}/>
  </Box>
}

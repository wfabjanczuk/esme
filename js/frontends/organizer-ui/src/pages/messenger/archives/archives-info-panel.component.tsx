import React, { useContext } from 'react'
import { Box } from '@mui/material'
import { ParticipantInfo } from '../shared/info-bar/participant-info.component'
import { EventInfo } from '../shared/info-bar/event-info.component'
import { ArchivesContext } from './archives.context'
import { styles } from '../../../layout/styles'

interface ArchivesInfoPanelProps {
  activeChatId: string
}

export const ArchivesInfoPanel = ({ activeChatId }: ArchivesInfoPanelProps): JSX.Element => {
  const { chats } = useContext(ArchivesContext)
  const activeChat = chats[activeChatId]

  if (activeChat === undefined) {
    return <></>
  }

  return <Box sx={styles.messenger.infoPanel}>
    <ParticipantInfo activeChat={activeChat}/>
    <EventInfo eventId={activeChat.eventId}/>
  </Box>
}

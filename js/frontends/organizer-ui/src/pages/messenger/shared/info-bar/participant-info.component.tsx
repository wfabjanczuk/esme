import { Box, Typography } from '@mui/material'
import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import { ParticipantLocation } from './participant-location.component'
import { styles } from '../../../../layout/styles'

interface ParticipantInfoProps {
  activeChat: Chat
}

export const ParticipantInfo = ({ activeChat }: ParticipantInfoProps): JSX.Element => {
  const participant = activeChat.participant

  return <Box>
    <Box sx={styles.messenger.infoPanelSection}>
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>Participant {activeChat.participantId}</Typography>
      {participant !== undefined && <React.Fragment>
        <Typography variant='subtitle2' fontWeight='bold'>Email:</Typography>
        <Typography variant='subtitle2'>{participant.email}</Typography>
        <Typography variant='subtitle2' fontWeight='bold'>Phone:</Typography>
        <Typography variant='subtitle2'>{participant.phoneNumber}</Typography>
      </React.Fragment>
      }
    </Box>
    <ParticipantLocation location={activeChat.location}/>
  </Box>
}

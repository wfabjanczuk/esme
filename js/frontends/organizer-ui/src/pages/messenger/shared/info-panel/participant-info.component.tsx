import { Box, Typography } from '@mui/material'
import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import { ParticipantLocation } from './participant-location.component'
import { styles } from '../../../../layout/styles'
import { InfoText } from './info-text.component'

interface ParticipantInfoProps {
  activeChat: Chat
}

export const ParticipantInfo = ({ activeChat }: ParticipantInfoProps): JSX.Element => {
  const participant = activeChat.participant

  return <Box>
    <Box sx={styles.messenger.infoPanelSection}>
      <Typography variant='h6' fontWeight='bold' sx={styles.messenger.infoPanelSectionHeader}>
        Participant {activeChat.participantId}
      </Typography>
      {participant !== undefined && <React.Fragment>
        <InfoText text='Email:' bold/>
        <InfoText text={participant.email}/>
        <InfoText text='Phone:' bold/>
        <InfoText text={participant.phoneNumber}/>
      </React.Fragment>
      }
    </Box>
    <ParticipantLocation location={activeChat.location}/>
  </Box>
}

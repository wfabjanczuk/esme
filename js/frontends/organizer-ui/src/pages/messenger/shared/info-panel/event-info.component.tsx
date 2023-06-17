import React from 'react'
import { useEventDetails } from '../../../events/event.entity'
import { Box, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { parseDateTimeLabel } from '../../../../common/utils'
import { styles } from '../../../../layout/styles'
import { InfoText } from './info-text.component'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

interface EventInfoProps {
  eventId: number
}

export const EventInfo = ({ eventId }: EventInfoProps): JSX.Element => {
  const { entity: event } = useEventDetails(eventId)
  if (event === undefined) {
    return <></>
  }

  return <Box>
    <Box sx={styles.messenger.infoPanelSection}>
      <Typography variant='h6' fontWeight='bold' sx={styles.messenger.infoPanelSectionHeader}>
        Event {event.id}
      </Typography>
      <InfoText text='Name:' bold/>
      <InfoText text={event.name}/>
      <InfoText text='Description:' bold/>
      <InfoText text={event.description}/>
      <InfoText text='Address:' bold/>
      <InfoText text={event.address}/>
      <InfoText text='Start:' bold/>
      <InfoText text={parseDateTimeLabel(event.timeStart)}/>
      <InfoText text='End:' bold/>
      <InfoText text={parseDateTimeLabel(event.timeEnd)}/>
    </Box>
    <CardMedia
      image={placeholderImage}
      sx={styles.messenger.eventImage}
    />
  </Box>
}

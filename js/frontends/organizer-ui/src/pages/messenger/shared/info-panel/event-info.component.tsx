import React from 'react'
import { useEventDetails } from '../../../events/event.entity'
import { Box, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { parseDateTimeLabel } from '../../../../common/utils'
import { styles } from '../../../../layout/styles'

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
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>Event {event.id}</Typography>
      <Typography variant='subtitle2' fontWeight='bold'>Name:</Typography>
      <Typography variant='subtitle2'>{event.name}</Typography>
      <Typography variant='subtitle2' fontWeight='bold'>Description:</Typography>
      <Typography variant='subtitle2'>{event.description}</Typography>
      <Typography variant='subtitle2' fontWeight='bold'>Address:</Typography>
      <Typography variant='subtitle2'>{event.address}</Typography>
      <Typography variant='subtitle2' fontWeight='bold'>Start:</Typography>
      <Typography variant='subtitle2'>{parseDateTimeLabel(event.timeStart)}</Typography>
      <Typography variant='subtitle2' fontWeight='bold'>End:</Typography>
      <Typography variant='subtitle2'>{parseDateTimeLabel(event.timeEnd)}</Typography>
    </Box>
    <CardMedia
      image={placeholderImage}
      sx={styles.messenger.eventImage}
    />
  </Box>
}

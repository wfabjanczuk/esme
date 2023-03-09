import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../../layout/styles'
import { CardTitle } from '../../../common/card-title.component'
import { useParams } from 'react-router-dom'
import { AddAnnouncementForm } from './add-announcement.form'

export const AddAnnouncementView = (): JSX.Element => {
  const { eventId: eventIdFromRoute } = useParams()
  const eventId = eventIdFromRoute === undefined ? undefined : parseInt(eventIdFromRoute, 10)

  return <Fragment>
    <Header title='Event announcement'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {eventId !== undefined
        ? <CreateAnnouncementCard eventId={eventId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface CreateAnnouncementCardProps {
  eventId: number
}

const CreateAnnouncementCard = ({ eventId }: CreateAnnouncementCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Add announcement' redirectLabel='Go to event' redirectUrl={`/events/${eventId}`}/>
    <AddAnnouncementForm eventId={eventId}/>
  </Paper>
}

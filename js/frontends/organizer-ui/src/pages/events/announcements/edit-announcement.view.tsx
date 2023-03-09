import { useParams } from 'react-router-dom'
import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import { AlertBar } from '../../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../../common/card-title.component'
import { EditAnnouncementForm } from './edit-announcement.form'

export const EditAnnouncementView = (): JSX.Element => {
  const {
    eventId: eventIdFromRoute,
    announcementId: announcementIdFromRoute
  } = useParams()
  const eventId = eventIdFromRoute === undefined ? undefined : parseInt(eventIdFromRoute, 10)
  const announcementId = announcementIdFromRoute === undefined ? undefined : parseInt(announcementIdFromRoute, 10)

  return <Fragment>
    <Header title='Event announcement'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {eventId !== undefined && announcementId !== undefined
        ? <EditAnnouncementCard eventId={eventId} announcementId={announcementId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface EditAnnouncementCardProps {
  eventId: number
  announcementId: number
}

const EditAnnouncementCard = ({ eventId, announcementId }: EditAnnouncementCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit announcement' redirectLabel='Go to event' redirectUrl={`/events/${eventId}`}/>
    <EditAnnouncementForm eventId={eventId} announcementId={announcementId}/>
  </Paper>
}

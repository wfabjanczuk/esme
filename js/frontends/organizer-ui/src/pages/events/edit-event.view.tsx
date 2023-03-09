import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { EditEventForm } from './edit-event.form'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'
import { ContactsList } from './contacts/contacts-list.component'
import { CardFooter } from '../../common/card-footer.component'
import { AnnouncementsList } from './announcements/announcements-list.component'

export const EditEventView = (): JSX.Element => {
  const { eventId: eventIdFromRoute } = useParams()
  const id = eventIdFromRoute === undefined ? undefined : parseInt(eventIdFromRoute, 10)

  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <Fragment>
          <EditEventCard id={id}/>
          <EventContactsCard eventId={id}/>
          <EventAnnouncementsCard eventId={id}/>
        </Fragment>
        : <></>
      }
    </Box>
  </Fragment>
}

const EditEventCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit event' redirectLabel='Go to events list' redirectUrl='/events'/>
    <EditEventForm id={id}/>
  </Paper>
}

const EventContactsCard = ({ eventId }: { eventId: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Event contacts'/>
    <ContactsList eventId={eventId}/>
    <CardFooter redirectLabel='Add contact' redirectUrl={`/events/${eventId}/contacts/add`}/>
  </Paper>
}

const EventAnnouncementsCard = ({ eventId }: { eventId: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Event announcements'/>
    <AnnouncementsList eventId={eventId}/>
    <CardFooter redirectLabel='Add announcement' redirectUrl={`/events/${eventId}/announcements/add`}/>
  </Paper>
}

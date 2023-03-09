import { useParams } from 'react-router-dom'
import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import { AlertBar } from '../../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../../common/card-title.component'
import { EditContactForm } from './edit-contact.form'

export const EditContactView = (): JSX.Element => {
  const {
    eventId: eventIdFromRoute,
    contactId: contactIdFromRoute
  } = useParams()
  const eventId = eventIdFromRoute === undefined ? undefined : parseInt(eventIdFromRoute, 10)
  const contactId = contactIdFromRoute === undefined ? undefined : parseInt(contactIdFromRoute, 10)

  return <Fragment>
    <Header title='Event contact'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {eventId !== undefined && contactId !== undefined
        ? <EditContactCard eventId={eventId} contactId={contactId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface EditContactCardProps {
  eventId: number
  contactId: number
}

const EditContactCard = ({ eventId, contactId }: EditContactCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit contact' redirectLabel='Go to event' redirectUrl={`/events/${eventId}`}/>
    <EditContactForm eventId={eventId} contactId={contactId}/>
  </Paper>
}

import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../../layout/styles'
import { CardTitle } from '../../../common/components/card-title.component'
import { useParams } from 'react-router-dom'
import { AddContactForm } from './add-contact.form'

export const AddContactView = (): JSX.Element => {
  const { eventId: eventIdFromRoute } = useParams()
  const eventId = eventIdFromRoute === undefined ? undefined : parseInt(eventIdFromRoute, 10)

  return <Fragment>
    <Header title='Event contact'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {eventId !== undefined
        ? <CreateContactCard eventId={eventId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface CreateContactCardProps {
  eventId: number
}

const CreateContactCard = ({ eventId }: CreateContactCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Add contact' redirectLabel='Go to event' redirectUrl={`/events/${eventId}`}/>
    <AddContactForm eventId={eventId}/>
  </Paper>
}

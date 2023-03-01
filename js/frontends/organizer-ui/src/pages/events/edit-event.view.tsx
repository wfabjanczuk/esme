import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { EditEventForm } from './edit-event.form'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'

export const EditEventView = (): JSX.Element => {
  const { id: idFromRoute } = useParams()
  const id = idFromRoute === undefined ? undefined : parseInt(idFromRoute, 10)

  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <EditEventCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const EditEventCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit event' entityName='event' listUrl='/events'/>
    <EditEventForm id={id}/>
  </Paper>
}

import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CreateEventForm } from './create-event.form'
import { EditCardTitle } from '../../common/edit-card-title.component'

export const CreateEventView = (): JSX.Element => {
  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <EditCardTitle action='Add' entityName='event' listUrl='/events'/>
        <CreateEventForm/>
      </Paper>
    </Box>
  </Fragment>
}

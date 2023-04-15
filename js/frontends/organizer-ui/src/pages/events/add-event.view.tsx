import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { AddEventForm } from './add-event.form'
import { CardTitle } from '../../common/components/card-title.component'

export const AddEventView = (): JSX.Element => {
  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Add event' redirectLabel='Go to events list' redirectUrl='/events'/>
        <AddEventForm/>
      </Paper>
    </Box>
  </Fragment>
}

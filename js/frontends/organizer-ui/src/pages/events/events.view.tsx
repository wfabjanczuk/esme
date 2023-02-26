import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { TableFooter } from '../../common/table-footer.component'
import { EventsList } from './events-list.component'

export const EventsView = (): JSX.Element => {
  return <Fragment>
    <Header title='Events'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='large'/>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse events</Typography>
        <EventsList/>
        <TableFooter entityName='event' addUrl='/events/add'/>
      </Paper>
    </Box>
  </Fragment>
}

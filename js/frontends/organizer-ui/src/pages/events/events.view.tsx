import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CardFooter } from '../../common/components/card-footer.component'
import { EventsList } from './events-list.component'

export const EventsView = (): JSX.Element => {
  return <Fragment>
    <Header title='Events'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse events</Typography>
        <EventsList/>
        <CardFooter redirectLabel='Add event' redirectUrl='/events/add'/>
      </Paper>
    </Box>
  </Fragment>
}

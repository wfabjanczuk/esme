import React, { Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'
import { AgencyForm } from './agency.form'
import { styles } from '../../layout/styles'

export const EditAgencyView = (): JSX.Element => {
  return <Fragment>
    <Header title='Agency'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardMedium}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Edit agency</Typography>
        <AgencyForm />
      </Paper>
    </Box>
  </Fragment>
}

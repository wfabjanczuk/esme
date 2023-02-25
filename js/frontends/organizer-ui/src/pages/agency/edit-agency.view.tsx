import React, { Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'
import { AgencyForm } from './agency.form'
import { styles } from '../../common/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const EditAgencyView = (): JSX.Element => {
  return <Fragment>
    <Header title='Agency'/>
    <Box component='main' sx={{ flex: 1, py: 2, px: 4, backgroundColor: '#eaeff1' }}>
      <AlertBar maxWidth='936px'/>
      <Paper sx={{
        maxWidth: '936px',
        margin: 'auto',
        overflow: 'hidden',
        px: 4,
        py: 2
      }}>
        <Typography component='h2' variant='h5' sx={styles.header}>Edit agency</Typography>
        <AgencyForm />
      </Paper>
    </Box>
  </Fragment>
}

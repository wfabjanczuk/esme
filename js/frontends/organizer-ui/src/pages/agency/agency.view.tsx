import React, { Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'
import { useAgency } from './agency.hook'
import { AgencyForm } from './agency.form'
import { styles } from '../common/styles'

export const AgencyView = (): JSX.Element => {
  const { agency, updateAgency, errorMessages } = useAgency()
  console.log('agency', agency)
  console.log('errorMessages', errorMessages)
  console.log('updateAgency', updateAgency)

  return <Fragment>
    <Header title='Agency'/>
    <Box component='main' sx={{ flex: 1, py: 6, px: 4, backgroundColor: '#eaeff1' }}>
      <Paper sx={{
        maxWidth: 936,
        margin: 'auto',
        overflow: 'hidden',
        px: 4,
        py: 2
      }}>
        <Typography component='h2' variant='h5' sx={styles.header}>Edit agency</Typography>
        <AgencyForm agency={agency} errorMessages={errorMessages}/>
      </Paper>
    </Box>
  </Fragment>
}

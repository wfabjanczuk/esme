import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { AgenciesList } from './agencies-list.component'
import { CardFooter } from '../../common/components/card-footer.component'
import { withAdminAuth } from '../../common/authorization/with-auth.hoc'

const _AdminAgenciesView = (): JSX.Element => {
  return <Fragment>
    <Header title='Agencies'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse agencies</Typography>
        <AgenciesList/>
        <CardFooter/>
      </Paper>
    </Box>
  </Fragment>
}

export const AdminAgenciesView = withAdminAuth(_AdminAgenciesView)

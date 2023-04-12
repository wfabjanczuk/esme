import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box, Typography } from '@mui/material'
import { AlertBar } from '../../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../../layout/styles'
import { withAdminAuth } from '../../../common/with-admin-auth.hoc'

const _AdminUsersView = (): JSX.Element => {
  return <Fragment>
    <Header title='Administrators'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='large'/>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse administrators</Typography>
      </Paper>
    </Box>
  </Fragment>
}

export const AdminUsersView = withAdminAuth(_AdminUsersView)

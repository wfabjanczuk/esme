import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { withAdminAuth } from '../../common/authorization/with-auth.hoc'
import { CardFooter } from '../../common/components/card-footer.component'
import { AdminUsersList } from './admin-users-list.component'

const _AdminUsersView = (): JSX.Element => {
  return <Fragment>
    <Header title='Administrators'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse administrators</Typography>
        <AdminUsersList/>
        <CardFooter redirectLabel='Add administrator' redirectUrl='/admin/users/add'/>
      </Paper>
    </Box>
  </Fragment>
}

export const AdminUsersView = withAdminAuth(_AdminUsersView)

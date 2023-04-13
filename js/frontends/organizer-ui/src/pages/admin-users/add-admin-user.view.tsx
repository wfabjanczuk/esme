import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CardTitle } from '../../common/components/card-title.component'
import { AddAdminUserForm } from './add-admin-user.form'
import { withSuperAdminAuth } from '../../common/authorization/with-auth.hoc'

const _AddAdminUserView = (): JSX.Element => {
  return <Fragment>
    <Header title='Administrator'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Add administrator' redirectLabel='Go to administrators list' redirectUrl='/admin/users'/>
        <AddAdminUserForm/>
      </Paper>
    </Box>
  </Fragment>
}

export const AddAdminUserView = withSuperAdminAuth(_AddAdminUserView)

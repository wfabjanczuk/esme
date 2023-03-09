import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CardTitle } from '../../common/card-title.component'
import { AddUserForm } from './add-user.form'

export const AddUserView = (): JSX.Element => {
  return <Fragment>
    <Header title='User'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Add user' redirectLabel='Go to users list' redirectUrl='/users'/>
        <AddUserForm/>
      </Paper>
    </Box>
  </Fragment>
}

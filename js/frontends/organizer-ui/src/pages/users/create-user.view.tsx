import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { EditCardTitle } from '../../common/edit-card-title.component'
import { CreateUserForm } from './create-user.form'

export const CreateUserView = (): JSX.Element => {
  return <Fragment>
    <Header title='User'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <EditCardTitle action='Add' entityName='user' listUrl='/users'/>
        <CreateUserForm/>
      </Paper>
    </Box>
  </Fragment>
}

import Header from '../../layout/header'
import { styles } from '../../layout/styles'
import React, { Fragment } from 'react'
import { Box } from '@mui/material'
import { CardTitle } from '../../common/components/card-title.component'
import Paper from '@mui/material/Paper'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { EditProfileForm } from './profile.form'
import { ChangePasswordForm } from './password.form'

export const ProfileView = (): JSX.Element => {
  return <Fragment>
    <Header title='Profile'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Edit profile'/>
        <EditProfileForm/>
      </Paper>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Change password'/>
        <ChangePasswordForm/>
      </Paper>
    </Box>
  </Fragment>
}

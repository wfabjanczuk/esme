import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { UsersList } from './users-list.component'
import { CardFooter } from '../../common/components/card-footer.component'

export const UsersView = (): JSX.Element => {
  return <Fragment>
    <Header title='Users'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='large'/>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse users</Typography>
        <UsersList/>
        <CardFooter redirectLabel='Add user' redirectUrl='/users/add'/>
      </Paper>
    </Box>
  </Fragment>
}

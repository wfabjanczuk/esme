import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'
import { EditAdminUserForm } from './edit-admin-user.form'
import { withSuperAdminAuth } from '../../common/authorization/with-auth.hoc'

const _EditAdminUserView = (): JSX.Element => {
  const { userId: userIdFromRoute } = useParams()
  const id = userIdFromRoute === undefined ? undefined : parseInt(userIdFromRoute, 10)

  return <Fragment>
    <Header title='Administrator'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <EditAdminUserCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const EditAdminUserCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit administrator' redirectLabel='Go to administrators list' redirectUrl='/admin/users'/>
    <EditAdminUserForm id={id}/>
  </Paper>
}

export const EditAdminUserView = withSuperAdminAuth(_EditAdminUserView)

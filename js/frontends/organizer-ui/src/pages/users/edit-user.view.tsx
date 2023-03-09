import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'
import { EditUserForm } from './edit-user.form'

export const EditUserView = (): JSX.Element => {
  const { userId: userIdFromRoute } = useParams()
  const id = userIdFromRoute === undefined ? undefined : parseInt(userIdFromRoute, 10)

  return <Fragment>
    <Header title='User'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <EditUserCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const EditUserCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit user' redirectLabel='Go to users list' redirectUrl='/users'/>
    <EditUserForm id={id}/>
  </Paper>
}

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { EditCardTitle } from '../../common/edit-card-title.component'
import { EditUserForm } from './edit-user.form'

export const EditUserView = (): JSX.Element => {
  const { id: idFromRoute } = useParams()
  const id = idFromRoute === undefined ? undefined : parseInt(idFromRoute, 10)

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
    <EditCardTitle action='Edit' entityName='user' listUrl='/users'/>
    <EditUserForm id={id}/>
  </Paper>
}

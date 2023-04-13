import React, { Fragment } from 'react'
import Header from '../../layout/header'
import Paper from '@mui/material/Paper'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { useParams } from 'react-router-dom'
import { AdminAgencyForm } from './admin-agency.form'
import { CardTitle } from '../../common/card-title.component'
import { withAdminAuth } from '../../common/authorization/with-auth.hoc'

const _AdminAgencyDetailsView = (): JSX.Element => {
  const { agencyId: agencyIdFromRoute } = useParams()
  const id = agencyIdFromRoute === undefined ? undefined : parseInt(agencyIdFromRoute, 10)

  return <Fragment>
    <Header title='Agency'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <AdminAgencyCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const AdminAgencyCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Agency details' redirectLabel='Go to agencies list' redirectUrl='/admin/agencies'/>
    <AdminAgencyForm id={id}/>
  </Paper>
}

export const AdminAgencyDetailsView = withAdminAuth(_AdminAgencyDetailsView)

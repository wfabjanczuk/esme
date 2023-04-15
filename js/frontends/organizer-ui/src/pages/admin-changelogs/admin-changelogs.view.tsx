import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { withAdminAuth } from '../../common/authorization/with-auth.hoc'
import { AdminChangelogsList } from './admin-changelogs-list.component'
import { CardFooter } from '../../common/components/card-footer.component'

const _AdminChangelogsView = (): JSX.Element => {
  return <Fragment>
    <Header title='Changelogs'/>
    <Box component='main' sx={styles.layout.content}>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse admin changelogs</Typography>
        <AdminChangelogsList/>
        <CardFooter/>
      </Paper>
    </Box>
  </Fragment>
}

export const AdminChangelogsView = withAdminAuth(_AdminChangelogsView)

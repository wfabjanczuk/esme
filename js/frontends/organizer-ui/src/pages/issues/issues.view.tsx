import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CardFooter } from '../../common/card-footer.component'
import { IssuesList } from './issues-list.component'

export const IssuesView = (): JSX.Element => {
  return <Fragment>
    <Header title='Issues'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='large'/>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse issues</Typography>
        <IssuesList />
        <CardFooter redirectLabel='Add issue' redirectUrl='/issues/add'/>
      </Paper>
    </Box>
  </Fragment>
}

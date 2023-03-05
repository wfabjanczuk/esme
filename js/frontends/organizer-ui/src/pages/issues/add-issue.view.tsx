import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { styles } from '../../layout/styles'
import { CardTitle } from '../../common/card-title.component'
import { AddIssueForm } from './add-issue.form'

export const AddIssueView = (): JSX.Element => {
  return <Fragment>
    <Header title='Issue'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      <Paper sx={styles.layout.cardMedium}>
        <CardTitle title='Add issue' redirectLabel='Go to issues list' redirectUrl='/issues'/>
        <AddIssueForm />
      </Paper>
    </Box>
  </Fragment>
}

import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import Paper from '@mui/material/Paper'
import { ChangelogsList } from './changelogs-list.component'
import { CardFooter } from '../../common/components/card-footer.component'

export const ChangelogsView = (): JSX.Element => {
  return <Fragment>
    <Header title='Changelogs'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='large'/>
      <Paper sx={styles.layout.cardLarge}>
        <Typography component='h2' variant='h5' sx={styles.layout.title}>Browse changelogs</Typography>
        <ChangelogsList/>
        <CardFooter />
      </Paper>
    </Box>
  </Fragment>
}

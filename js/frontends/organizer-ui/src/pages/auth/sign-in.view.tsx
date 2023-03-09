import React from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { SignInForm } from './sign-in.form'
import { styles } from '../../layout/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const SignInView = (): JSX.Element => {
  return <Box sx={styles.layout.root}>
    <Box component='main' sx={styles.layout.background}>
      <AlertBar size='small'/>
      <Paper sx={styles.layout.cardSmall}>
        <Typography variant='h4' component='h1' sx={styles.layout.title}>Emergency service</Typography>
        <SignInForm/>
      </Paper>
    </Box>
  </Box>
}

import React from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { SignInForm } from './sign-in.form'
import { styles } from '../../common/styles'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const SignInView = (): JSX.Element => {
  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <AlertBar maxWidth='480px'/>
      <Paper sx={{
        ...styles.card,
        maxWidth: '480px'
      }}>
        <Typography variant='h4' component='h1' sx={styles.header}>Emergency service</Typography>
        <SignInForm/>
      </Paper>
    </Box>
  </Box>
}

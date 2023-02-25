import React from 'react'
import { Box, Typography } from '@mui/material'
import { styles } from '../../common/styles'
import Paper from '@mui/material/Paper'
import { SignUpForm } from './sign-up.form'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

export const SignUpView = (): JSX.Element => {
  return <Box sx={styles.root}>
    <Box component='main' sx={styles.background}>
      <AlertBar maxWidth='960px'/>
      <Paper sx={{
        ...styles.card,
        maxWidth: '960px'
      }}>
        <Typography variant='h4' component='h1' sx={styles.header}>Register event agency</Typography>
        <SignUpForm/>
      </Paper>
    </Box>
  </Box>
}

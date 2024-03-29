import React from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { SignInForm } from './sign-in.form'
import { styles } from '../../layout/styles'

export const SignInView = (): JSX.Element => {
  return <Box sx={styles.layout.root}>
    <Box component='main' sx={styles.layout.background}>
      <Paper sx={styles.layout.cardSmall}>
        <Typography variant='h4' component='h1' sx={styles.layout.titleCenter}>Emergency service</Typography>
        <Typography sx={styles.layout.placeholderText}>Sign in as an organizer</Typography>
        <SignInForm/>
      </Paper>
    </Box>
  </Box>
}

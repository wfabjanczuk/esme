import React from 'react'
import { Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { SignUpForm } from './sign-up.form'

export const SignUpView = (): JSX.Element => {
  return <Box sx={styles.layout.root}>
    <Box component='main' sx={styles.layout.background}>
      <Paper sx={styles.layout.cardMedium}>
        <Typography variant='h4' component='h1' sx={styles.layout.titleCenter}>Register event agency</Typography>
        <SignUpForm/>
      </Paper>
    </Box>
  </Box>
}

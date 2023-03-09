import React from 'react'
import { useRouteError } from 'react-router-dom'
import { Alert, Box } from '@mui/material'
import { styles } from '../layout/styles'

interface RouteError {
  statusText?: string
  message?: string
}

export const ErrorView = (): JSX.Element => {
  const error = useRouteError() as RouteError

  return (<Box style={styles.layout.root}>
    <Box component='main' sx={styles.layout.content}>
      <Alert variant='filled' severity='error' sx={styles.layout.fullWidth}>
        {getDisplayMessage(error)}
      </Alert>
    </Box>
  </Box>
  )
}

const getDisplayMessage = (error: RouteError): string => {
  if (error.statusText != null) {
    return error.statusText
  }
  if (error.message != null) {
    return error.message
  }

  return 'Error unknown'
}

import React, { Fragment } from 'react'
import { useRouteError } from 'react-router-dom'
import { Alert, Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import Header from '../dashboard/header'

interface RouteError {
  statusText?: string
  message?: string
}

export const ErrorView = (): JSX.Element => {
  const error = useRouteError() as RouteError

  return (<Fragment>
    <Header title='Error'/>
    <Box component='main' sx={{ flex: 1, py: 6, px: 4, backgroundColor: '#eaeff1' }}>
      <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}
        elevation={0}>
        <Alert variant='filled' severity='error' sx={{ width: '100%' }}>
          {getDisplayMessage(error)}
        </Alert>
      </Paper>
    </Box>
  </Fragment>
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

import React from 'react'
import { useRouteError } from 'react-router-dom'
import { Alert } from '@mui/material'

interface RouteError {
  statusText?: string
  message?: string
}

export const ErrorView = (): JSX.Element => {
  const error = useRouteError() as RouteError

  return (
    <Alert severity='error' sx={{ m: 2 }}>
      {getDisplayMessage(error)}
    </Alert>
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

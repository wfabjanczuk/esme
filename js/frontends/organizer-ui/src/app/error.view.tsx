import React from 'react'
import { useRouteError } from 'react-router-dom'
import { Alert, Box } from '@mui/material'
import { styles } from '../layout/styles'

interface RouteError {
  statusText?: string
  message?: string
}

interface ErrorViewProps {
  errorMessages?: string[]
}

export const ErrorView = ({ errorMessages }: ErrorViewProps): JSX.Element => {
  const errors = errorMessages === undefined
    ? [getDisplayMessage(useRouteError() as RouteError)]
    : errorMessages

  return (<Box style={styles.layout.root}>
    <Box component='main' sx={styles.layout.content}>
      {errors.map((message, index) => (
        <Alert key={`error_${index}`} variant='filled' severity='error' sx={styles.layout.fullWidth}>
          {message}
        </Alert>
      ))}
    </Box>
  </Box>
  )
}

const getDisplayMessage = (error: RouteError): string => {
  if (error?.statusText != null) {
    return error.statusText
  }
  if (error?.message != null) {
    return error.message
  }

  return 'Error unknown'
}

import React, { useContext } from 'react'
import { AlertStoreContext } from './alert-store.context'
import { Alert, Box, Typography } from '@mui/material'
import { styles } from '../styles'
import { AlertColor } from '@mui/material/Alert/Alert'

interface AlertBarProps {
  maxWidth?: string
}

export const AlertBar = ({ maxWidth = '100%' }: AlertBarProps): JSX.Element => {
  const { alerts } = useContext(AlertStoreContext)

  return <Box sx={{ margin: 'auto', py: 2, maxWidth }}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} type={a.type} content={a.content}/>
    )}
  </Box>
}

interface AlertBarElementProps {
  type: AlertColor
  content: string
}

const AlertBarElement = ({ type, content }: AlertBarElementProps): JSX.Element => (
  <Alert
    variant='filled'
    severity={type}
    sx={styles.formAlert}
  >
    <Typography component='div'>{content}</Typography>
  </Alert>
)

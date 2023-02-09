import React, { useContext } from 'react'
import { AlertBarContext } from './alert-bar.context'
import { Alert, Box, Typography } from '@mui/material'
import { styles } from '../styles'
import { AlertColor } from '@mui/material/Alert/Alert'

export const AlertBar = (): JSX.Element => {
  const { alerts } = useContext(AlertBarContext)

  return <Box sx={{ py: 2 }}>
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

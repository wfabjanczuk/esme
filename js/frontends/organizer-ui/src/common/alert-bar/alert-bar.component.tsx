import React, { useContext } from 'react'
import { AlertStoreContext } from './alert-store.context'
import { Alert, Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'
import { AlertColor } from '@mui/material/Alert/Alert'

type sizeType = 'small' | 'medium' | 'large'

interface AlertBarProps {
  size: sizeType
}

export const AlertBar = ({ size }: AlertBarProps): JSX.Element => {
  const { alerts } = useContext(AlertStoreContext)

  return <Box sx={{ margin: 'auto', py: 2, ...getContainerStyle(size) }}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} type={a.type} content={a.content}/>
    )}
  </Box>
}

const getContainerStyle = (variant: sizeType): Record<string, string> => {
  switch (variant) {
  case 'small': return {
    maxWidth: '480px'
  }
  case 'medium': return {
    maxWidth: '960px'
  }
  case 'large': return {
    maxWidth: '1500px'
  }
  }
}

interface AlertBarElementProps {
  type: AlertColor
  content: string
}

const AlertBarElement = ({ type, content }: AlertBarElementProps): JSX.Element => (
  <Alert
    variant='filled'
    severity={type}
    sx={styles.alertBar.alert}
  >
    <Typography component='div'>{content}</Typography>
  </Alert>
)

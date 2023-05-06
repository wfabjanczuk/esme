import React, { useContext, useLayoutEffect } from 'react'
import { AlertStoreContext, FlashAlert } from './alert-store.context'
import { Alert, Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'

const alertDisplayTime = 5000

export const AlertBar = (): JSX.Element => {
  const {
    state: { alerts },
    remove
  } = useContext(AlertStoreContext)

  return <Box sx={styles.alertBar.container}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} alert={a} remove={remove}/>
    )}
  </Box>
}

interface AlertBarElementProps {
  alert: FlashAlert
  remove: (id: number) => void
}

const AlertBarElement = ({
  alert: {
    id,
    content,
    type
  },
  remove
}: AlertBarElementProps): JSX.Element => {
  useLayoutEffect(() => {
    setTimeout(() => remove(id), alertDisplayTime)
  }, [id, remove])

  return (
    <Alert
      variant='filled'
      severity={type}
      onClose={() => remove(id)}
      sx={styles.alertBar.alert}
    >
      <Typography component='div'>{content}</Typography>
    </Alert>
  )
}

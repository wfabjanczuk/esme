import React from 'react'
import { Typography } from '@mui/material'
import { styles } from '../../../../layout/styles'

interface InfoTextProps {
  text: string
  bold?: boolean
}

export const InfoText = ({ text, bold }: InfoTextProps): JSX.Element => {
  const isBold = bold ?? false

  return <Typography variant='subtitle2' fontWeight={isBold ? 'bold' : 'normal'} sx={styles.messenger.infoText}>
    {text}
  </Typography>
}

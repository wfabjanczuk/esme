import React from 'react'
import { Typography } from '@mui/material'

interface Props {
  text: string
}

export const PlaceholderView = ({ text }: Props): JSX.Element => {
  if (text === 'Error') {
    throw new Error('Oh dang!')
  }

  return <Typography>{text}</Typography>
}

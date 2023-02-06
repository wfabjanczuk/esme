import React, { Fragment } from 'react'
import { Box } from '@mui/material'
import Content from './content'
import Header from './header'

interface Props {
  text: string
}

export const PlaceholderView = ({ text }: Props): JSX.Element => {
  if (text === 'Error') {
    throw new Error('Oh dang!')
  }

  return <Fragment>
    <Header title={text}/>
    <Box component='main' sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
      <Content />
    </Box>
  </Fragment>
}

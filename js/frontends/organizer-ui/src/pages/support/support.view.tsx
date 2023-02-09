import React, { Fragment } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import Divider from '@mui/material/Divider'

export const SupportView = (): JSX.Element => {
  return <Fragment>
    <Header title='Live support'/>
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: '20%', backgroundColor: '#eaeff1' }}>
        Chats
        <Divider/>
      </Box>
      <Box sx={{ width: '60%' }}>Messages</Box>
      <Box sx={{ width: '20%', backgroundColor: '#eaeff1' }}>Participant</Box>
    </Box>
  </Fragment>
}

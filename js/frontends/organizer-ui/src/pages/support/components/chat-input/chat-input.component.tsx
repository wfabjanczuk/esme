import React from 'react'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import SendIcon from '@mui/icons-material/Send'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import IconButton from '@mui/material/IconButton'

export const ChatInput = (): JSX.Element => {
  return <Box>
    <Divider/>
    <Box sx={{
      display: 'flex',
      px: 1,
      py: 0.6,
      alignItems: 'center'
    }}>
      <IconButton sx={{
        mr: 1,
        color: '#006494'
      }}>
        <AddCircleIcon/>
      </IconButton>
      <TextField multiline={true} size='small' sx={{ flexGrow: 1 }} maxRows={5}/>
      <IconButton sx={{
        ml: 1,
        color: '#006494'
      }}>
        <SendIcon/>
      </IconButton>
    </Box>
  </Box>
}

import React, { useContext, useState } from 'react'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import SendIcon from '@mui/icons-material/Send'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import IconButton from '@mui/material/IconButton'
import { MessengerContext } from '../../../../common/messenger/messenger.context'

interface ChatInputProps {
  chatId: string
}

export const ChatInput = ({ chatId }: ChatInputProps): JSX.Element => {
  const [message, setMessage] = useState<string>('')
  const messenger = useContext(MessengerContext)

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
      <TextField multiline={true} size='small' sx={{ flexGrow: 1 }} maxRows={5} value={message}
        onChange={e => setMessage(e.target.value)}/>
      <IconButton sx={{
        ml: 1,
        color: '#006494'
      }}
      onClick={() => messenger.sendMessage(chatId, message)}
      >
        <SendIcon/>
      </IconButton>
    </Box>
  </Box>
}

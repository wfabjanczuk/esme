import React, { KeyboardEvent, useContext, useState } from 'react'
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
  const handleSend = (): void => {
    if (message !== '') {
      messenger.sendMessage(chatId, message)
      setMessage('')
    }
  }
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

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
        color: '#006db3'
      }}>
        <AddCircleIcon/>
      </IconButton>
      <TextField multiline={true} sx={{ flexGrow: 1 }} minRows={2} maxRows={5} value={message} size='small'
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton onClick={handleSend} sx={{
        ml: 1,
        color: '#006db3'
      }}>
        <SendIcon/>
      </IconButton>
    </Box>
  </Box>
}

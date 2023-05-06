import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { Close } from '@mui/icons-material'

interface ChatCloserProps {
  activeChatId: string
}

export const ChatCloser = ({ activeChatId }: ChatCloserProps): JSX.Element => {
  const messenger = useContext(MessengerContext)

  return <Button
    color='error'
    variant='contained'
    sx={{ m: 2 }}
    startIcon={<Close/>}
    onClick={() => messenger.closeChat(activeChatId)}
  >
    Close chat
  </Button>
}

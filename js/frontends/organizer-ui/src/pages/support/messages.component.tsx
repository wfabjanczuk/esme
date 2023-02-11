import { Box } from '@mui/material'
import React, { useContext } from 'react'
import { InboxContext } from '../../common/messenger/inbox.context'

interface MessagesProps {
  chatId: string
}

export const Messages = ({ chatId }: MessagesProps): JSX.Element => {
  const { messages } = useContext(InboxContext)

  return <Box sx={{ width: '60%' }}>
    {chatId !== ''
      ? messages[chatId]?.map((msg) => (
        <div key={`${chatId}_${msg.id}`}>{msg.content}</div>
      ))
      : <></>
    }
  </Box>
}

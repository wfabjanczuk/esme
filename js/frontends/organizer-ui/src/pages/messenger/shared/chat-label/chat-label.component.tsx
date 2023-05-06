import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import { Typography } from '@mui/material'

interface ChatLabelProps {
  chat: Chat
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const ChatLabel = ({
  chat,
  activeChatId,
  setActiveChatId
}: ChatLabelProps): JSX.Element => {
  const label = (chat.participant === undefined)
    ? `Participant ${chat.participantId} (Event ${chat.eventId})`
    : `${chat.participant.email} (Event ${chat.eventId})`

  return <ListItem disablePadding>
    <ListItemButton
      className={'light'}
      selected={activeChatId === chat.id}
      onClick={() => setActiveChatId(chat.id)}
      sx={{ fontSize: '0.9rem' }}
    >
      <Typography variant='subtitle2'>{label}</Typography>
    </ListItemButton>
  </ListItem>
}

import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'

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
    ? `Event ${chat.eventId} / Participant ${chat.participantId}`
    : `Event ${chat.eventId} / ${chat.participant.email}`

  return <ListItem disablePadding>
    <ListItemButton
      className={'light'}
      selected={activeChatId === chat.id}
      onClick={() => setActiveChatId(chat.id)}
    >
      {label}
    </ListItemButton>
  </ListItem>
}

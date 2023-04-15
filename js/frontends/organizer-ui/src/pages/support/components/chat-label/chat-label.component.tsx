import React from 'react'
import { Chat } from '../../../../common/messenger/structures'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import { useParticipantDetails } from '../../../../common/participant/participant.hook'

interface ChatLabelProps {
  chat: Chat
  activeChatId: string
  setActiveChatId: (chatId: string) => void
}

export const ChatLabel = ({ chat, activeChatId, setActiveChatId }: ChatLabelProps): JSX.Element => {
  const { participant } = useParticipantDetails(chat.participantId)

  let label
  if (participant === undefined) {
    label = `Event ${chat.eventId} / Participant ${chat.participantId}`
  } else {
    label = `Event ${chat.eventId} / ${participant.email}`
  }

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

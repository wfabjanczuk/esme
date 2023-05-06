import React, { Fragment } from 'react'
import { TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'
import { ActiveChatBadge } from './active-chat-badge.component'
import { ChatCardTitle } from './chat-card-title.component'
import { ChatCardContent } from './chat-card.styles'
import { ChatDescription } from './chat-description.component'
import { ChatIcon } from './chat-icon.component'
import { useEvent } from '../../../events/event.hook'
import { parseDate } from '../../../../common/utils'
import { Chat } from '../../../../common/messenger/structures'

interface ChatCardProps {
  chat: Chat
  onPress: () => void
}

export const ChatCard = ({
  chat,
  onPress
}: ChatCardProps): JSX.Element => {
  const { event } = useEvent(chat.eventId)
  const isEnded = chat.ended === 1

  if (event === undefined) {
    return <></>
  }

  return (
    <Fragment>
      <TouchableOpacity onPress={onPress}>
        <ChatCardContent
          title={
            <ChatCardTitle eventName={event.name} isEnded={isEnded}/>
          }
          description={<ChatDescription timeStart={parseDate(chat.timeStart)} isEnded={isEnded}/>}
          left={() => (
            <ChatIcon isEnded={isEnded}/>
          )}
          right={() => !isEnded && <ActiveChatBadge/>}
        />
      </TouchableOpacity>
      <Divider/>
    </Fragment>
  )
}

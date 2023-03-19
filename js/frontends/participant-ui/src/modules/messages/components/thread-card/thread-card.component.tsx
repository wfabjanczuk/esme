import React, { Fragment } from 'react'
import { TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper'

import { ThreadBadge } from './thread-badge.component'
import { ThreadCardTitle } from './thread-card-title.component'
import { ThreadCardContent } from './thread-card.styles'
import { ThreadDescription } from './thread-description.component'
import { ThreadIcon } from './thread-icon.component'
import { useEvent } from '../../../events/event.hook'
import { parseDate } from '../../../../common/utils'
import { Chat } from '../../../../common/messenger/structures'

interface ThreadCardProps {
  chat: Chat
  onPress: () => void
}

export const ThreadCard = ({
  chat,
  onPress
}: ThreadCardProps): JSX.Element => {
  const { event } = useEvent(chat.eventId)

  if (event === undefined) {
    return <></>
  }

  return (
    <Fragment>
      <TouchableOpacity onPress={onPress}>
        <ThreadCardContent
          title={
            <ThreadCardTitle eventName={event.name} unread={false}/>
          }
          description={<ThreadDescription date={parseDate(event.timeStart)} unread={false}/>}
          left={() => (
            <ThreadIcon threadType='conversation' unread={false}/>
          )}
          right={() => false && <ThreadBadge content='UNREAD'/>}
        />
      </TouchableOpacity>
      <Divider/>
    </Fragment>
  )
}

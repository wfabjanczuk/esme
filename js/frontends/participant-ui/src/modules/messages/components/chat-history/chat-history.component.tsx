import React from 'react'
import { ScrollView } from 'react-native'

import { Spacer } from '../../../../common/components/spacer/spacer.component'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../common/messenger/structures'

interface ChatHistoryProps {
  messages: Message[]
}

export const ChatHistory = ({ messages }: ChatHistoryProps): JSX.Element => (
  <ScrollView>
    {messages.map(m => (
      <Spacer key={m.id} position='top' size='medium'>
        <ChatBubble isOwn={m.fromOrganizer === 0} content={m.content}/>
      </Spacer>
    ))}
  </ScrollView>
)

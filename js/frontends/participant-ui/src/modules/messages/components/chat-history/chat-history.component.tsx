import React from 'react'
import { ScrollView } from 'react-native'

import { Spacer } from '../../../../shared/components/spacer/spacer.component'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../shared/services/mock/mock.context'

interface ChatHistoryProps {
  conversation: Message[]
}

export const ChatHistory = ({ conversation }: ChatHistoryProps): JSX.Element => (
  <ScrollView>
    {conversation.map(c => (
      <Spacer key={c.sent} position='top' size='medium'>
        <ChatBubble isOwn={c.isOwn} content={c.content}/>
      </Spacer>
    ))}
  </ScrollView>
)

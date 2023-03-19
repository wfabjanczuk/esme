import React, { useContext, useState } from 'react'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { MockContext } from '../../common/services/mock/mock.context'
import { ChatHistory } from './components/chat-history/chat-history.component'
import { ChatInput } from './components/chat-input/chat-input.component'

export const ConversationScreen = (): JSX.Element => {
  const { conversation: mockedConversation } = useContext(MockContext)
  const [conversation, setConversation] = useState(mockedConversation)
  const addMessage = (message: string): void => {
    const currentTimestamp = Date.now() / 1000

    setConversation([
      ...conversation,
      {
        sent: currentTimestamp,
        isOwn: true,
        content: message
      }
    ])
  }

  return (
    <SafeArea>
      <ChatHistory conversation={conversation} />
      <ChatInput addMessage={addMessage} />
    </SafeArea>
  )
}

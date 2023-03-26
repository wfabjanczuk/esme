import React, { useContext, useState } from 'react'
import { ChatAttachmentButton, ChatInputContainer, ChatSendButton, ChatTextInput } from './chat-input.styles'
import { MessengerContext } from '../../../../common/messenger/messenger.context'

interface ChatInputProps {
  chatId: string
}

export const ChatInput = ({ chatId }: ChatInputProps): JSX.Element => {
  const [message, setMessage] = useState<string>('')
  const messenger = useContext(MessengerContext)
  const handleSend = (): void => {
    if (message !== '') {
      messenger.sendMessage(chatId, message)
      setMessage('')
    }
  }

  return (
    <ChatInputContainer>
      <ChatAttachmentButton onPress={() => null}/>
      <ChatTextInput
        placeholder='Enter your message'
        value={message}
        onChangeText={setMessage}
      />
      <ChatSendButton onPress={handleSend}/>
    </ChatInputContainer>
  )
}

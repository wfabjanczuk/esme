import React, { useState } from 'react'

import {
  ChatAttachmentButton,
  ChatInputContainer,
  ChatSendButton,
  ChatTextInput
} from './chat-input.styles'

interface ChatInputProps {
  addMessage: (message: string) => void
}

export const ChatInput = ({ addMessage }: ChatInputProps): JSX.Element => {
  const [message, setMessage] = useState('')
  const onPress = (): void => {
    if (message.length === 0) {
      return
    }

    addMessage(message)
    setMessage('')
  }

  return (
    <ChatInputContainer>
      <ChatAttachmentButton onPress={() => null} />
      <ChatTextInput
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      <ChatSendButton onPress={onPress} />
    </ChatInputContainer>
  )
}

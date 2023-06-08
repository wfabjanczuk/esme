import React, { useContext, useState } from 'react'
import { ChatAttachmentButton, ChatInputContainer, ChatSendButton, ChatTextInput } from './chat-input.styles'
import { MessengerContext } from '../../../../common/messenger/messenger.context'
import { useCoordinates } from '../../../../common/hooks/coordinates.hook'

interface ChatInputProps {
  chatId: string
}

export const ChatInput = ({ chatId }: ChatInputProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const coordinates = useCoordinates()
  const [message, setMessage] = useState<string>('')
  const handleSend = (): void => {
    if (message !== '') {
      messenger.sendMessage({
        chatId,
        message,
        ...coordinates
      })
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

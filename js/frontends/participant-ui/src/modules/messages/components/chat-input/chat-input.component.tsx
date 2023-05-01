import React, { useContext, useEffect, useState } from 'react'
import { ChatAttachmentButton, ChatInputContainer, ChatSendButton, ChatTextInput } from './chat-input.styles'
import { MessengerContext } from '../../../../common/messenger/messenger.context'
import { LocationObject } from 'expo-location/src/Location.types'
import * as Location from 'expo-location'

interface ChatInputProps {
  chatId: string
}

export const ChatInput = ({ chatId }: ChatInputProps): JSX.Element => {
  const [message, setMessage] = useState<string>('')
  const [location, setLocation] = useState<LocationObject | undefined>(undefined)
  const messenger = useContext(MessengerContext)
  const handleSend = (): void => {
    if (message !== '') {
      messenger.sendMessage(chatId, message, location?.coords.latitude, location?.coords.longitude)
      setMessage('')
    }
  }

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

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

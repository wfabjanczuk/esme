import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { theme as globalTheme } from '../../../../layout'
import { ChatCardIconContainer } from './chat-icon.styles'

interface ChatIconProps {
  isEnded: boolean
}

export const ChatIcon = ({ isEnded }: ChatIconProps): JSX.Element => {
  const color = isEnded
    ? globalTheme.colors.ui.secondary
    : globalTheme.colors.ui.primary

  return (
    <ChatCardIconContainer>
      <Ionicons name={'chatbubble-ellipses'} size={32} color={color}/>
    </ChatCardIconContainer>
  )
}

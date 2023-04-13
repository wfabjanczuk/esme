import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { theme as globalTheme } from '../../../../layout'
import { ThreadCardIconContainer } from './thread-icon.styles'

interface ThreadIconProps {
  unread: boolean
}

export const ThreadIcon = ({ unread }: ThreadIconProps): JSX.Element => {
  const color = unread
    ? globalTheme.colors.ui.primary
    : globalTheme.colors.ui.secondary

  return (
    <ThreadCardIconContainer>
      <Ionicons name={'chatbubble-ellipses'} size={32} color={color}/>
    </ThreadCardIconContainer>
  )
}

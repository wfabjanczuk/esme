import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { theme as globalTheme } from '../../../../theme'
import { ThreadCardIconContainer } from './thread-icon.styles'

interface ThreadIconProps {
  threadType: 'conversation' | 'announcement'
  unread: boolean
}

export const ThreadIcon = ({ threadType, unread }: ThreadIconProps): JSX.Element => {
  const name =
        threadType === 'conversation' ? 'chatbubble-ellipses' : 'alert-circle'
  const color = unread
    ? globalTheme.colors.ui.primary
    : globalTheme.colors.ui.secondary

  return (
    <ThreadCardIconContainer>
      <Ionicons name={name} size={32} color={color}/>
    </ThreadCardIconContainer>
  )
}

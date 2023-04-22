import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { Spacer } from '../../../../common/components/spacer/spacer.component'
import { ChatBubble } from './chat-bubble.component'
import { Message } from '../../../../common/messenger/structures'
import styled from 'styled-components/native'
import { parseDateTimeChatLabel } from '../../../../common/utils'

interface ChatHistoryProps {
  messages: Message[]
}

export const ChatHistory = ({ messages }: ChatHistoryProps): JSX.Element => {
  const heightRef = useRef<number>(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToBottom = (width: number, height: number): void => {
    heightRef.current = height
    scrollViewRef.current?.scrollTo({
      y: height,
      animated: false
    })
  }

  useEffect(() => scrollToBottom(0, heightRef.current), [heightRef.current])

  return <ScrollView ref={scrollViewRef} onContentSizeChange={scrollToBottom}
    onLayout={() => scrollToBottom(0, heightRef.current)}
  >
    {messages.map(m => {
      const isOwn = m.fromOrganizer === 0
      return (
        <Spacer key={m.id} position='top' size='medium'>
          <TimeLabel isOwn={isOwn}>{parseDateTimeChatLabel(m.timeSent)}</TimeLabel>
          <ChatBubble isOwn={isOwn} content={m.content}/>
        </Spacer>
      )
    })}
  </ScrollView>
}

const TimeLabel = styled.Text<{ isOwn: boolean }>`
  margin-left: ${props => props.isOwn ? props.theme.spaces[5] : props.theme.spaces[2]};
  margin-bottom: 3px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.caption};
`

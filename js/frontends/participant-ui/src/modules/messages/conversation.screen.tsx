import React, { useContext, useEffect } from 'react'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { ChatHistory } from './components/chat-history/chat-history.component'
import { ChatInput } from './components/chat-input/chat-input.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FrontStackParamsList } from '../../app/navigation/navigation-internal'
import { InboxContext } from '../../common/messenger/inbox.context'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import { StyledText } from '../../common/components/typography/styled-text.component'

type ConversationScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Conversation'>

export const ConversationScreen = ({ route: { params: { chatId } } }: ConversationScreenProps): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const messenger = useContext(MessengerContext)
  const { chats, messages } = useContext(InboxContext)
  const chat = chats.get(chatId)
  const chatMessages = messages.get(chatId)

  const headerHeight = useHeaderHeight()
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight : 0

  useEffect(() => {
    if (!messenger.isInitialized()) {
      alertStore.add('error', 'WebSocket connection could not be initialized')
    }
  }, [messenger.isInitialized()])

  if (chat === undefined || chatMessages === undefined) {
    return <></>
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ChatHistory messages={chatMessages}/>
        {chat.ended === 0
          ? <ChatInput chatId={chatId}/>
          : <StyledText variant={'placeholder'}>Chat has ended.</StyledText>
        }
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

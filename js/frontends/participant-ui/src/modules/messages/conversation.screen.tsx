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

type ConversationScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Conversation'>

export const ConversationScreen = ({ route: { params: { chatId } } }: ConversationScreenProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const alertStore = useContext(AlertStoreContext)
  const { messages } = useContext(InboxContext)
  const headerHeight = useHeaderHeight()
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight : 0

  useEffect(() => {
    if (!messenger.isInitialized()) {
      alertStore.add('error', 'WebSocket connection could not be initialized')
    }
  }, [messenger.isInitialized()])

  if (messages[chatId] === undefined) {
    return <></>
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ChatHistory messages={messages[chatId]}/>
        <ChatInput chatId={chatId}/>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

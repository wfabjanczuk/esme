import React, { useContext, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BottomTabsParamsList } from '../../app/navigation/navigation-internal'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { InboxContext } from '../../common/messenger/inbox.context'
import { ChatCard } from './components/chat-card/chat-card.component'
import { AlertStoreContext } from '../../common/alert-bar/alert-store.context'
import { useIsFocused } from '@react-navigation/native'

type ChatsScreenProps = NativeStackScreenProps<BottomTabsParamsList, 'Messages'>

export const ChatsScreen = ({ navigation }: ChatsScreenProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const alertStore = useContext(AlertStoreContext)
  const isFocused = useIsFocused()
  const { chats } = useContext(InboxContext)

  useEffect(() => {
    if (!messenger.isInitialized() && isFocused) {
      alertStore.add('error', 'WebSocket connection could not be initialized')
    }
  }, [messenger.isInitialized(), isFocused])

  const newOnPressHandler = (chatId: string) => () => navigation.navigate('Conversation', { chatId })

  return (
    <SafeArea>
      <FlatList
        data={Array.from(chats.values())}
        renderItem={({ item }) => (
          <Spacer position='top' size='medium'>
            <ChatCard chat={item} onPress={newOnPressHandler(item.id)}/>
          </Spacer>
        )}
        keyExtractor={item => `chat_${item.id}`}
        ListEmptyComponent={<NoChatsPlaceholder/>}
      />
    </SafeArea>
  )
}

const NoChatsPlaceholder = (): JSX.Element => {
  return <Spacer size='large' position='top'>
    <StyledText variant='placeholder'>No chats found.</StyledText>
  </Spacer>
}

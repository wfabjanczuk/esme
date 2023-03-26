import React, { useContext } from 'react'
import { FlatList } from 'react-native'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BottomTabsParamsList } from '../../app/navigation/navigation-internal'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { InboxContext } from '../../common/messenger/inbox.context'
import { ThreadCard } from './components/thread-card/thread-card.component'

type ThreadsScreenProps = NativeStackScreenProps<BottomTabsParamsList, 'Messages'>

export const ThreadsScreen = ({ navigation }: ThreadsScreenProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const { chats } = useContext(InboxContext)

  if (!messenger.isInitialized()) {
    return <SafeArea>
      <StyledText variant='error'>WebSocket connection could not be initialized</StyledText>
    </SafeArea>
  }

  const newOnPressHandler = (chatId: string) => () => navigation.navigate('Conversation', { chatId })

  return (
    <SafeArea>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <Spacer position='top' size='medium'>
            <ThreadCard chat={item} onPress={newOnPressHandler(item.id)}/>
          </Spacer>
        )}
        keyExtractor={item => `chat_${item.eventId}`}
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

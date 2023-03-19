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

type ChatsScreenProps = NativeStackScreenProps<BottomTabsParamsList, 'Messages'>

export const ThreadsScreen = ({ navigation }: ChatsScreenProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const { chats } = useContext(InboxContext)
  console.log(chats)

  if (!messenger.isInitialized()) {
    return <SafeArea>
      <StyledText variant='error'>WebSocket connection could not be initialized</StyledText>
    </SafeArea>
  }

  const onCardPress = (): void => navigation.navigate('Conversation')

  return (
    <SafeArea>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <Spacer position='top' size='medium'>
            <StyledText>chuj</StyledText>
            <ThreadCard chat={item} onPress={onCardPress}/>
          </Spacer>
        )}
        keyExtractor={item => `chat_${item.eventId}`}
      />
    </SafeArea>
  )
}

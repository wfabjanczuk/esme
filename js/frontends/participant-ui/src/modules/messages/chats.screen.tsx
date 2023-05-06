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
import { ArchivesContext } from './archives/archives.context'

type ChatsScreenProps = NativeStackScreenProps<BottomTabsParamsList, 'Chats'>

export const ChatsScreen = ({ navigation }: ChatsScreenProps): JSX.Element => {
  const messenger = useContext(MessengerContext)
  const alertStore = useContext(AlertStoreContext)
  const isFocused = useIsFocused()
  const { chats } = useContext(InboxContext)
  const archives = useContext(ArchivesContext)

  const sortedChats = Array.from([...chats.values(), ...Object.values(archives.chats)]).sort((a, b) => {
    return (a.ended === b.ended)
      ? a.timeStart < b.timeStart ? 1 : -1
      : a.ended > b.ended ? 1 : -1
  })

  useEffect(() => {
    if (!messenger.isInitialized() && isFocused) {
      alertStore.add('error', 'WebSocket connection could not be initialized')
    }
  }, [messenger.isInitialized(), isFocused])

  useEffect(() => {
    if (archives.hasState()) {
      archives.fetchChats()
    }
  }, [archives.hasState(), isFocused])

  const newOnPressHandler = (chatId: string) => () => navigation.navigate('Conversation', { chatId })

  return (
    <SafeArea>
      <FlatList
        data={sortedChats}
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

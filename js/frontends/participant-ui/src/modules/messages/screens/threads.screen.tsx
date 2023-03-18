import React, { useContext } from 'react'
import { FlatList } from 'react-native'
import { Spacer } from '../../../common/components/spacer/spacer.component'
import { SafeArea } from '../../../common/components/containers/safe-area.component'
import { MockContext, Thread } from '../../../common/services/mock/mock.context'
import { ThreadCard } from '../components/thread-card/thread-card.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainTabsParamsList } from '../../../app/navigation/navigation-internal'

type ThreadsScreenProps = NativeStackScreenProps<MainTabsParamsList, 'Messages'>

export const ThreadsScreen = ({ navigation }: ThreadsScreenProps): JSX.Element => {
  const { threads } = useContext(MockContext)
  const onCardPress = (item: Thread): void =>
    item.type === 'conversation'
      ? navigation.navigate('Conversation')
      : navigation.navigate('Announcements')

  return (
    <SafeArea>
      <FlatList
        data={threads}
        renderItem={({ item }) => (
          <Spacer position='top' size='medium'>
            <ThreadCard thread={item} onPress={() => onCardPress(item)} />
          </Spacer>
        )}
        keyExtractor={item => `${item.event}_${item.type}`}
      />
    </SafeArea>
  )
}

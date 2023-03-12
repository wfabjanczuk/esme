import React, { useContext } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'

import { SafeArea } from '../../../common/components/containers/safe-area.component'
import { MockContext } from '../../../common/services/mock/mock.context'

export const EventsScreen = (): JSX.Element => {
  const { events } = useContext(MockContext)

  return (
    <SafeArea>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: 'white', marginTop: 10 }}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
    </SafeArea>
  )
}

import React, { Fragment, useContext } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'

import { SafeArea } from '../../../common/components/containers/safe-area.component'
import { MockContext } from '../../../common/services/mock/mock.context'
import styled from 'styled-components/native'
import { PaperTextInput } from '../../../common/components/overrides'
import { Divider } from 'react-native-paper'

export const StyledTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[0]} ${props => props.theme.spaces[0]};
`

export const EventsScreen = (): JSX.Element => {
  const { events } = useContext(MockContext)

  return (
    <SafeArea>
      <StyledTextInput label='event' mode='outlined' />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <Fragment>
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: 'white', marginTop: 10 }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
            <Divider />
          </Fragment>
        )}
        keyExtractor={item => item.name}
      />
    </SafeArea>
  )
}

import React, { Fragment } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import styled from 'styled-components/native'
import { PaperTextInput } from '../../common/components/overrides'
import { Divider } from 'react-native-paper'
import { useEventsList } from './events.hook'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { Event } from './event.entity'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'

export const StyledTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[2]};
`

export const EventsScreen = (): JSX.Element => {
  const { events, setQuery } = useEventsList()

  return (
    <SafeArea>
      <StyledTextInput label='search events' mode='outlined' onChangeText={setQuery}/>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventCard event={item}/>}
        keyExtractor={e => e.name}
        ListEmptyComponent={<EmptyListPlaceholder/>}
      />
    </SafeArea>
  )
}

const EventCard = ({ event }: { event: Event }): JSX.Element => {
  return (
    <Fragment>
      <TouchableOpacity style={{ padding: 10 }}>
        <StyledText>{event.name}</StyledText>
        <StyledText variant='caption'>Address: {event.address}</StyledText>
        <StyledText variant='caption'>
          Start: {parseDateTimeLabel(event.timeStart)} |
          End: {parseDateTimeLabel(event.timeEnd)}
        </StyledText>
      </TouchableOpacity>
      <Divider/>
    </Fragment>
  )
}

const EmptyListPlaceholder = (): JSX.Element => {
  return <Spacer size='large' position='top'>
    <StyledText variant='placeholder'>No events found.</StyledText>
  </Spacer>
}

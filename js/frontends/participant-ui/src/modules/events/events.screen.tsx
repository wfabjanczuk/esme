import React, { Fragment } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { PaperTextInput } from '../../common/components/overrides'
import { Divider } from 'react-native-paper'
import { useEventsList } from './events-list.hook'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { Event } from './event.entity'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainTabsParamsList } from '../../app/navigation/navigation-internal'

type EventsScreenProps = NativeStackScreenProps<MainTabsParamsList, 'Get help'>

export const EventsScreen = (props: EventsScreenProps): JSX.Element => {
  const {
    events,
    setQuery
  } = useEventsList()
  const newOnPress = (id: number) => (): void => {
    props.navigation.navigate('Event details', { id })
  }

  return (
    <SafeArea>
      <StyledText variant='title'>Select event to get help</StyledText>
      <Spacer size='large' position='horizontal'>
        <PaperTextInput label='search' mode='outlined' onChangeText={setQuery}/>
      </Spacer>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventCard event={item} onPress={newOnPress(item.id)}/>}
        keyExtractor={e => e.name}
        ListEmptyComponent={<NoEventsPlaceholder/>}
      />
    </SafeArea>
  )
}

interface EventCardProps {
  event: Event
  onPress: () => void
}

const EventCard = ({
  event,
  onPress
}: EventCardProps): JSX.Element => {
  return (
    <Fragment>
      <TouchableOpacity onPress={onPress}>
        <Spacer size='large' position='all'>
          <Spacer size='medium' position='bottom'>
            <StyledText>{event.name}</StyledText>
          </Spacer>
          <StyledText variant='caption'>Address: {event.address}</StyledText>
          <StyledText variant='caption'>Start: {parseDateTimeLabel(event.timeStart)}</StyledText>
          <StyledText variant='caption'>End: {parseDateTimeLabel(event.timeEnd)}</StyledText>
        </Spacer>
      </TouchableOpacity>
      <Divider/>
    </Fragment>
  )
}

const NoEventsPlaceholder = (): JSX.Element => {
  return <Spacer size='large' position='top'>
    <StyledText variant='placeholder'>No events found.</StyledText>
  </Spacer>
}

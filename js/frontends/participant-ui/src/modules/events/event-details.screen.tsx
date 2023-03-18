import { SafeArea } from '../../common/components/containers/safe-area.component'
import React from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FrontStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'

type EventDetailsScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Event details'>

export const EventDetailsScreen = ({ route: { params: { id } } }: EventDetailsScreenProps): JSX.Element => {
  const { event } = useEvent(id)

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  return (
    <SafeArea>
      <StyledText variant='title'>{event.name}</StyledText>
      <Spacer size='medium' position='horizontal'>
        <StyledText variant='caption'>Address: {event.address}</StyledText>
        <StyledText variant='caption'>Start: {parseDateTimeLabel(event.timeStart)}</StyledText>
        <StyledText variant='caption'>End: {parseDateTimeLabel(event.timeEnd)}</StyledText>
      </Spacer>
      <Spacer size='medium' position='all'>
        <StyledText>{event.description}</StyledText>
      </Spacer>
    </SafeArea>
  )
}

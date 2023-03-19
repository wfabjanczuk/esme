import { SafeArea } from '../../common/components/containers/safe-area.component'
import React from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FrontStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { Card } from 'react-native-paper'
import { SuccessButton } from '../../common/components/button.component'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

type EventDetailsScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Event details'>

export const EventDetailsScreen = ({ route: { params: { id } } }: EventDetailsScreenProps): JSX.Element => {
  const {
    event
  } = useEvent(id)

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  return (
    <SafeArea>
      <Spacer size='large' position='all'>
        <Card.Cover source={{ uri: placeholderImage }}/>
      </Spacer>
      <StyledText variant='title'>{event.name}</StyledText>
      <Spacer size='large' position='horizontal'>
        <StyledText variant='caption'>Address: {event.address}</StyledText>
        <StyledText variant='caption'>Start: {parseDateTimeLabel(event.timeStart)}</StyledText>
        <StyledText variant='caption'>End: {parseDateTimeLabel(event.timeEnd)}</StyledText>
      </Spacer>
      <Spacer size='large' position='all'>
        <StyledText>{event.description}</StyledText>
      </Spacer>
      <SuccessButton icon='medical-services' onPress={() => null}>
        Request help
      </SuccessButton>
    </SafeArea>
  )
}

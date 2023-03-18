import { SafeArea } from '../../common/components/containers/safe-area.component'
import React from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FrontStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { Card } from 'react-native-paper'
import { ErrorButton, SuccessButton } from '../../common/components/button.component'
import { FormErrors } from '../../common/components/form-errors.component'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

type EventDetailsScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Event details'>

export const EventDetailsScreen = ({ route: { params: { id } } }: EventDetailsScreenProps): JSX.Element => {
  const {
    errorMessages,
    event,
    subscribe,
    unsubscribe
  } = useEvent(id)

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  return (
    <SafeArea>
      <Spacer size='medium' position='all'>
        <Card.Cover source={{ uri: placeholderImage }}/>
      </Spacer>
      <StyledText variant='title'>{event.name}</StyledText>

      <Spacer size='medium' position='horizontal'>
        <StyledText variant='caption'>Address: {event.address}</StyledText>
        <StyledText variant='caption'>Start: {parseDateTimeLabel(event.timeStart)}</StyledText>
        <StyledText variant='caption'>End: {parseDateTimeLabel(event.timeEnd)}</StyledText>
      </Spacer>
      <Spacer size='medium' position='all'>
        <StyledText>{event.description}</StyledText>
      </Spacer>
      <SuccessButton icon='person-add' onPress={subscribe}>
        Subscribe to announcements
      </SuccessButton>
      <ErrorButton icon='person-remove' onPress={unsubscribe}>
        Unsubscribe from announcements
      </ErrorButton>
      <FormErrors errorMessages={errorMessages}/>
    </SafeArea>
  )
}

import { SafeArea } from '../../common/components/containers/safe-area.component'
import React, { Fragment } from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { EventStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeChatLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { Card } from 'react-native-paper'
import { PrimaryButton } from '../../common/components/button.component'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { View } from 'react-native'
import { EventHelpForm } from './event-help.form'
import { useCoordinates } from '../../common/hooks/coordinates.hook'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

type EventDetailsScreenProps = NativeStackScreenProps<EventStackParamsList, 'Event details'>

export const EventDetailsScreen = ({
  navigation,
  route: { params: { id } }
}: EventDetailsScreenProps): JSX.Element => {
  const coordinates = useCoordinates()
  const navigateToChats = (): void => navigation.navigate('Chats')
  const {
    errorMessages,
    event,
    requestChat
  } = useEvent(id)
  const isError = errorMessages.length > 0

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  const requestHelp = (description: string): void => requestChat({
    ...coordinates,
    description,
    eventId: id
  }, navigateToChats)

  return (
    <SafeArea>
      <FullScreenScrollView>
        <View>
          <Spacer size='large' position='horizontal'>
            <Card.Cover source={{ uri: placeholderImage }}/>
          </Spacer>
          <StyledText variant='title'>{event.name}</StyledText>
          <Spacer size='large' position='horizontal'>
            <StyledText variant='caption'>Address: {event.address}</StyledText>
            <StyledText variant='caption'>Start: {parseDateTimeChatLabel(event.timeStart)}</StyledText>
            <StyledText variant='caption'>End: {parseDateTimeChatLabel(event.timeEnd)}</StyledText>
          </Spacer>
          <Spacer size='large' position='all'>
            <StyledText>{event.description}</StyledText>
          </Spacer>
        </View>
        <View>
          {event.isChatRequested
            ? <Fragment>
              <Spacer size='medium' position='all'>
                <StyledText variant='placeholder'>Help already requested.</StyledText>
              </Spacer>
              <PrimaryButton icon='arrow-back' onPress={navigateToChats}>
                Go to Messages
              </PrimaryButton>
            </Fragment>
            : <EventHelpForm
              requestHelp={requestHelp}
              errorMessages={errorMessages}
              isError={isError}
            />
          }
        </View>
      </FullScreenScrollView>
    </SafeArea>

  )
}

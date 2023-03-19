import { SafeArea } from '../../common/components/containers/safe-area.component'
import React, { Fragment } from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { EventStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { Card } from 'react-native-paper'
import { PrimaryButton, SuccessButton } from '../../common/components/button.component'
import { PaperTextInput } from '../../common/components/overrides'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { View } from 'react-native'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

type EventDetailsScreenProps = NativeStackScreenProps<EventStackParamsList, 'Event details'>

export const EventDetailsScreen = ({
  navigation,
  route: { params: { id } }
}: EventDetailsScreenProps): JSX.Element => {
  const { event } = useEvent(id)

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  return (
    <SafeArea>
      <FullScreenScrollView>
        <View>
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
        </View>
        <View>
          {event.isChatRequested
            ? <Fragment>
              <Spacer size='medium' position='all'>
                <StyledText variant='placeholder'>Help already requested.</StyledText>
              </Spacer>
              <PrimaryButton icon='arrow-back' onPress={() => navigation.navigate('Messages')}>
                Go to Messages
              </PrimaryButton>
            </Fragment>
            : <Fragment>
              <Spacer size='large' position='all'>
                <PaperTextInput label='problem description' mode='outlined' multiline/>
              </Spacer>
              <SuccessButton icon='medical-services' onPress={() => null}>
                Request help
              </SuccessButton>
            </Fragment>
          }
        </View>
      </FullScreenScrollView>
    </SafeArea>

  )
}

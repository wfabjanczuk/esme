import { SafeArea } from '../../common/components/containers/safe-area.component'
import React, { Fragment, useEffect, useState } from 'react'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { EventStackParamsList } from '../../app/navigation/navigation-internal'
import { useEvent } from './event.hook'
import { parseDateTimeChatLabel } from '../../common/utils'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { Card } from 'react-native-paper'
import { PrimaryButton, SuccessButton } from '../../common/components/button.component'
import { PaperTextInput } from '../../common/components/overrides'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { View } from 'react-native'
import { LocationObject } from 'expo-location/src/Location.types'
import * as Location from 'expo-location'
import { FormErrors } from '../../common/components/form.component'

const placeholderImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

type EventDetailsScreenProps = NativeStackScreenProps<EventStackParamsList, 'Event details'>

export const EventDetailsScreen = ({
  navigation,
  route: { params: { id } }
}: EventDetailsScreenProps): JSX.Element => {
  const [location, setLocation] = useState<LocationObject | undefined>(undefined)
  const [description, setDescription] = useState('')
  const {
    errorMessages,
    event,
    requestChat
  } = useEvent(id)
  const isError = errorMessages.length > 0

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  if (event === undefined) {
    return <SafeArea><StyledText>Loading...</StyledText></SafeArea>
  }

  const {
    coords: {
      latitude: lat,
      longitude: lng
    }
  } = location ?? {
    coords: {
      latitude: 0,
      longitude: 0
    }
  }
  const requestHelp = (): void => requestChat({
    description,
    lat,
    lng,
    eventId: id
  })

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
              <PrimaryButton icon='arrow-back' onPress={() => navigation.navigate('Messages')}>
                Go to Messages
              </PrimaryButton>
            </Fragment>
            : <Fragment>
              <Spacer size='large' position='all'>
                <PaperTextInput label='problem description' mode='outlined' error={isError} multiline
                  onChangeText={setDescription}/>
              </Spacer>
              <FormErrors errorMessages={errorMessages}/>
              <SuccessButton icon='medical-services' onPress={requestHelp}>
                Request help
              </SuccessButton>
            </Fragment>
          }
        </View>
      </FullScreenScrollView>
    </SafeArea>

  )
}

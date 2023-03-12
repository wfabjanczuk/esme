import React from 'react'
import { SafeArea } from '../../../shared/containers/safe-area.component'
import { Spacer } from '../../../shared/components/spacer/spacer.component'
import { StyledText } from '../../../shared/components/typography/styled-text.component'
import { HelpFormButton } from '../../help/screens/help.styles'
import { TextInput } from 'react-native-paper'

export const SignInScreen = (): JSX.Element => {
  return (
    <SafeArea>
      <Spacer size='large' position='top'>
        <StyledText variant='placeholder'>Emergency Service for Mass Events</StyledText>
      </Spacer>
      <StyledText variant='title'>Emergency service</StyledText>
      <TextInput label='email' mode='outlined'/>
      <TextInput label='password' mode='outlined' secureTextEntry/>
      <HelpFormButton icon='phone-outgoing' onPress={() => null}>
        Request help
      </HelpFormButton>
    </SafeArea>
  )
}

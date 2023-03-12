import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { StyledText } from '../../../common/components/typography/styled-text.component'
import { SafeArea } from '../../../common/components/containers/safe-area.component'
import {
  HelpFormButton,
  HelpFormCheckboxInputContainer,
  HelpFormInput
} from './help.styles'
import { Spacer } from '../../../common/components/spacer/spacer.component'

export const HelpScreen = (): JSX.Element => {
  const [checked, setChecked] = useState(false)

  return (
    <SafeArea>
      <Spacer size='large' position='top'>
        <StyledText variant='placeholder'>Emergency Service for Mass Events</StyledText>
      </Spacer>
      <StyledText variant='title'>Request help</StyledText>
      <HelpFormInput label='Event' />
      <HelpFormInput label='Problem description' />
      <HelpFormCheckboxInputContainer>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked)
          }}
        />
        <StyledText variant='checkboxLabel'>
          Start conversation with support team
        </StyledText>
      </HelpFormCheckboxInputContainer>
      <HelpFormButton icon='phone-forwarded' onPress={() => null}>
        Request help
      </HelpFormButton>
    </SafeArea>
  )
}

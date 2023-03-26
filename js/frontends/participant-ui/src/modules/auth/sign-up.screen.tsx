import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { useValues } from '../../common/hooks/values.hook'
import { useSignUp } from './sign-up.hook'
import { DefaultForm, DefaultTextInput, FormErrors } from '../../common/components/form.component'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { ButtonGroup, SuccessButton } from '../../common/components/button.component'

export const SignUpScreen = (): JSX.Element => {
  const {
    signUp,
    errorMessages
  } = useSignUp()
  const isError = errorMessages.length > 0

  const {
    values,
    newSetter
  } = useValues({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  })

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <StyledText variant='title'>Register as a participant</StyledText>
        <DefaultForm>
          <DefaultTextInput label='email' mode='outlined' error={isError}
            onChangeText={newSetter('email')}/>
          <DefaultTextInput label='phone number' mode='outlined' error={isError}
            onChangeText={newSetter('phoneNumber')}/>
          <DefaultTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('password')}/>
          <DefaultTextInput label='confirm password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <SuccessButton icon='person-add' onPress={() => signUp(values)}>
              Register
            </SuccessButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

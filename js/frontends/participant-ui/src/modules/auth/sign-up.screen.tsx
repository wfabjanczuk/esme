import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { AuthButtonGroup, AuthForm, AuthTextInput } from './styles'
import { useValues } from '../../common/hooks/values.hook'
import { useSignUp } from './sign-up.hook'
import { FormErrors } from '../../common/components/form-errors.component'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { SuccessButton } from '../../common/components/button.component'

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
        <AuthForm>
          <AuthTextInput label='email' mode='outlined' error={isError}
            onChangeText={newSetter('email')}/>
          <AuthTextInput label='phone number' mode='outlined' error={isError}
            onChangeText={newSetter('phoneNumber')}/>
          <AuthTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('password')}/>
          <AuthTextInput label='confirm password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <FormErrors errorMessages={errorMessages}/>
          <AuthButtonGroup>
            <SuccessButton icon='person-add' onPress={() => signUp(values)}>
              Register
            </SuccessButton>
          </AuthButtonGroup>
        </AuthForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

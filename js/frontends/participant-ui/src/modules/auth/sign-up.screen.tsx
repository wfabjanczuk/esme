import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { ButtonGroup, Form, StyledTextInput } from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useValues } from '../../common/hooks/values.hook'
import { useSignUp } from './sign-up.hook'
import { FormErrors } from '../../common/components/form-errors.component'
import { FullScreenScrollView } from '../../common/components/containers/full-screen-scroll-view.component'
import { FrontStackParamsList } from '../../app/navigation/navigation-external'
import { ErrorButton, SuccessButton } from '../../common/components/button.component'

type SignUpScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Registration'>

export const SignUpScreen = ({ navigation }: SignUpScreenProps): JSX.Element => {
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
        <Form>
          <StyledTextInput label='email' mode='outlined' error={isError}
            onChangeText={newSetter('email')}/>
          <StyledTextInput label='phone number' mode='outlined' error={isError}
            onChangeText={newSetter('phoneNumber')}/>
          <StyledTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('password')}/>
          <StyledTextInput label='confirm password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <SuccessButton icon='person-add' onPress={() => signUp(values)}>
              Register
            </SuccessButton>
            <ErrorButton icon='close' onPress={() => navigation.navigate('Authentication')}>
              Cancel
            </ErrorButton>
          </ButtonGroup>
        </Form>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

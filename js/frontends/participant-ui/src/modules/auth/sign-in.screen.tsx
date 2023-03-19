import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { AuthButtonGroup, AuthForm, AuthTextInput } from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useValues } from '../../common/hooks/values.hook'
import { useSignIn } from './sign-in.hook'
import { FormErrors } from '../../common/components/form-errors.component'
import { FullScreenScrollView } from '../../common/components/containers/full-screen-scroll-view.component'
import { FrontStackParamsList } from '../../app/navigation/navigation-external'
import { PrimaryButton, SuccessButton } from '../../common/components/button.component'

type SignInScreenProps = NativeStackScreenProps<FrontStackParamsList, 'Authentication'>

export const SignInScreen = ({ navigation }: SignInScreenProps): JSX.Element => {
  const {
    signIn,
    errorMessages
  } = useSignIn()
  const isError = errorMessages.length > 0

  const {
    values,
    newSetter
  } = useValues({
    email: '',
    password: ''
  })

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <StyledText variant='title'>Emergency service</StyledText>
        <StyledText variant='placeholder'>Sign in as a participant</StyledText>
        <AuthForm>
          <AuthTextInput label='email' mode='outlined' error={isError}
            onChangeText={newSetter('email')}
          />
          <AuthTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('password')}
          />
          <FormErrors errorMessages={errorMessages}/>
          <AuthButtonGroup>
            <PrimaryButton icon='login' onPress={() => signIn(values)}>
              Sign in
            </PrimaryButton>
            <SuccessButton icon='person-add' onPress={() => navigation.navigate('Registration')}>
              Register
            </SuccessButton>
          </AuthButtonGroup>
        </AuthForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

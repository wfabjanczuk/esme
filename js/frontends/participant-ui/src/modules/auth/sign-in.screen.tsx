import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useValues } from '../../common/hooks/values.hook'
import { useSignIn } from './sign-in.hook'
import { DefaultForm, DefaultTextInput, FormErrors } from '../../common/components/form.component'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { FrontStackParamsList } from '../../app/navigation/navigation-external'
import { ButtonGroup, PrimaryButton, SuccessButton } from '../../common/components/button.component'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'

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
      <AlertBar />
      <FullScreenScrollView>
        <StyledText variant='title'>Emergency service</StyledText>
        <StyledText variant='placeholder'>Sign in as a participant</StyledText>
        <DefaultForm>
          <DefaultTextInput label='email' mode='outlined' error={isError}
            onChangeText={newSetter('email')}
          />
          <DefaultTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('password')}
          />
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <PrimaryButton icon='login' onPress={() => signIn(values)}>
              Sign in
            </PrimaryButton>
            <SuccessButton icon='person-add' onPress={() => navigation.navigate('Registration')}>
              Register
            </SuccessButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

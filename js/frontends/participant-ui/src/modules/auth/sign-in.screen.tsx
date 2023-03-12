import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { ButtonGroup, Form, FormScrollView, RegisterButton, SignInButton, StyledTextInput } from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import { useValues } from '../../common/hooks/values.hook'
import { useSignIn } from './sign-in.hook'

type SignInScreenProps = NativeStackScreenProps<ParamListBase, 'Authentication'>

export const SignInScreen = ({ navigation }: SignInScreenProps): JSX.Element => {
  const { signIn, errorMessages } = useSignIn()
  const { values, newSetter } = useValues({
    email: '', password: ''
  })
  console.log(errorMessages)

  return (
    <SafeAreaCentered>
      <FormScrollView>
        <StyledText variant='title'>Emergency service</StyledText>
        <StyledText variant='placeholder'>Sign in as a participant</StyledText>
        <Form>
          <StyledTextInput label='email' mode='outlined' onChangeText={newSetter('email')}/>
          <StyledTextInput label='password' mode='outlined' onChangeText={newSetter('password')} secureTextEntry/>
          <ButtonGroup>
            <SignInButton icon='login' onPress={() => signIn(values)}>
              Sign in
            </SignInButton>
            <RegisterButton icon='person-add' onPress={() => navigation.navigate('Registration')}>
              Register
            </RegisterButton>
          </ButtonGroup>
        </Form>
      </FormScrollView>
    </SafeAreaCentered>
  )
}

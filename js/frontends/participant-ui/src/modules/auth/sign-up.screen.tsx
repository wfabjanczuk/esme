import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { ButtonGroup, CancelButton, Form, FormScrollView, RegisterButton, StyledTextInput } from './styles'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase } from '@react-navigation/native'
import { useValues } from '../../common/hooks/values.hook'

type SignUpScreenProps = NativeStackScreenProps<ParamListBase, 'Registration'>

export const SignUpScreen = ({ navigation }: SignUpScreenProps): JSX.Element => {
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
      <FormScrollView>
        <StyledText variant='title'>Register as a participant</StyledText>
        <Form>
          <StyledTextInput label='email' mode='outlined'
            onChangeText={newSetter('email')}/>
          <StyledTextInput label='phone number' mode='outlined'
            onChangeText={newSetter('phoneNumber')}/>
          <StyledTextInput label='password' mode='outlined' secureTextEntry
            onChangeText={newSetter('password')}/>
          <StyledTextInput label='confirm password' mode='outlined' secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <StyledTextInput label='email' mode='outlined'
            onChangeText={newSetter('email')}/>
          <StyledTextInput label='phone number' mode='outlined'
            onChangeText={newSetter('phoneNumber')}/>
          <StyledTextInput label='password' mode='outlined' secureTextEntry
            onChangeText={newSetter('password')}/>
          <StyledTextInput label='confirm password' mode='outlined' secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <StyledTextInput label='email' mode='outlined'
            onChangeText={newSetter('email')}/>
          <StyledTextInput label='phone number' mode='outlined'
            onChangeText={newSetter('phoneNumber')}/>
          <StyledTextInput label='password' mode='outlined' secureTextEntry
            onChangeText={newSetter('password')}/>
          <StyledTextInput label='confirm password' mode='outlined' secureTextEntry
            onChangeText={newSetter('confirmPassword')}/>
          <ButtonGroup>
            <RegisterButton icon='person-add' onPress={() => console.log(values)}>
              Register
            </RegisterButton>
            <CancelButton icon='close' onPress={() => navigation.navigate('Authentication')}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      </FormScrollView>
    </SafeAreaCentered>
  )
}

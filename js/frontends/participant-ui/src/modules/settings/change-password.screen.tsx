import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { DefaultForm, DefaultTextInput, FormErrors } from '../../common/components/form.component'
import { ButtonGroup, ErrorButton } from '../../common/components/button.component'
import { useValues } from '../../common/hooks/values.hook'

export const ChangePasswordScreen = (): JSX.Element => {
  const errorMessages: string[] = []
  const isError = false

  const {
    values,
    newSetter
  } = useValues({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <DefaultForm>
          <DefaultTextInput label='old password' mode='outlined' error={isError}
            onChangeText={newSetter('oldPassword')}/>
          <DefaultTextInput label='password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('newPassword')}/>
          <DefaultTextInput label='confirm new password' mode='outlined' error={isError} secureTextEntry
            onChangeText={newSetter('confirmNewPassword')}/>
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <ErrorButton icon='lock' onPress={() => null}>
              Change password
            </ErrorButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

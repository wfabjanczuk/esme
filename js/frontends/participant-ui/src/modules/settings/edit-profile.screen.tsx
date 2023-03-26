import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { useValues } from '../../common/hooks/values.hook'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { DefaultForm, DefaultTextInput, FormErrors } from '../../common/components/form.component'
import { ButtonGroup, SuccessButton } from '../../common/components/button.component'
import { useEditProfile } from './edit-profile.hook'

export const EditProfileScreen = (): JSX.Element => {
  const {
    errorMessages,
    profile,
    update
  } = useEditProfile()
  const isError = errorMessages.length > 0
  const isProfile = profile !== undefined

  const {
    values,
    newSetter
  } = useValues({
    phoneNumber: isProfile ? profile.phoneNumber : ''
  })

  if (!isProfile) {
    return <></>
  }

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <DefaultForm>
          <DefaultTextInput label='phone number' mode='outlined' error={isError} defaultValue={profile.phoneNumber}
            onChangeText={newSetter('phoneNumber')}/>
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <SuccessButton icon='save' onPress={() => update(values)}>
              Save profile data
            </SuccessButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

import React, { useEffect } from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { useValues } from '../../common/hooks/values.hook'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { DefaultForm, DefaultTextInput, FormErrors } from '../../common/components/form.component'
import { ButtonGroup, SuccessButton } from '../../common/components/button.component'
import { useEditProfile } from './edit-profile.hook'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SettingsStackParamsList } from '../../app/navigation/navigation-internal'

type EditProfileScreenProps = NativeStackScreenProps<SettingsStackParamsList, 'Edit profile'>

export const EditProfileScreen = ({ navigation }: EditProfileScreenProps): JSX.Element => {
  const {
    errorMessages,
    profile,
    update
  } = useEditProfile()
  const isError = errorMessages.length > 0
  const isProfile = profile !== undefined
  const onUpdate = (): void => navigation.navigate('Settings menu')

  const {
    values,
    setValues,
    newSetter
  } = useValues({
    phoneNumber: ''
  })

  useEffect(() => {
    if (isProfile) {
      setValues({
        phoneNumber: profile.phoneNumber
      })
    }
  }, [isProfile])

  if (!isProfile) {
    return <></>
  }

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <DefaultForm>
          <DefaultTextInput label='phone number' mode='outlined' error={isError} value={values.phoneNumber}
            onChangeText={newSetter('phoneNumber')}/>
          <FormErrors errorMessages={errorMessages}/>
          <ButtonGroup>
            <SuccessButton icon='save' onPress={() => update(values, onUpdate)}>
              Save profile data
            </SuccessButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

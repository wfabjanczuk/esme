import React from 'react'
import { SafeAreaCentered } from '../../common/components/containers/safe-area.component'
import { useValues } from '../../common/hooks/values.hook'
import { FullScreenScrollView } from '../../common/components/containers/scroll-view.component'
import { DefaultForm, DefaultTextInput } from '../../common/components/form.component'
import { ButtonGroup, SuccessButton } from '../../common/components/button.component'

export const EditProfileScreen = (): JSX.Element => {
  const errorMessages: string[] = []
  const isError = false

  const {
    values,
    newSetter
  } = useValues({
    phoneNumber: ''
  })

  return (
    <SafeAreaCentered>
      <FullScreenScrollView>
        <DefaultForm>
          <DefaultTextInput label='phone number' mode='outlined' error={isError}
            onChangeText={newSetter('phoneNumber')}/>
          <ButtonGroup>
            <SuccessButton icon='save' onPress={() => null}>
              Save profile data
            </SuccessButton>
          </ButtonGroup>
        </DefaultForm>
      </FullScreenScrollView>
    </SafeAreaCentered>
  )
}

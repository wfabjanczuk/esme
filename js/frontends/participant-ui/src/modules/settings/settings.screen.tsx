import React, { useContext } from 'react'
import { ScrollView } from 'react-native'
import { Divider, List } from 'react-native-paper'
import { Spacer } from '../../common/components/spacer/spacer.component'
import { StyledText } from '../../common/components/typography/styled-text.component'
import { SafeArea } from '../../common/components/containers/safe-area.component'
import { AvatarContainer, AvatarPlaceholder, SettingsItem, SettingsItemIcon } from './settings.styles'
import { AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SettingsStackParamsList } from '../../app/navigation/navigation-internal'
import { useProfileDetails } from './edit-profile.hook'
import { FormErrors } from '../../common/components/form.component'

type SettingsScreenProps = NativeStackScreenProps<SettingsStackParamsList, 'Settings menu'>

export const SettingsScreen = ({ navigation }: SettingsScreenProps): JSX.Element => {
  const authenticator = useContext(AuthenticatorContext)
  const { errorMessages, profile } = useProfileDetails()

  if (errorMessages.length > 0) {
    return <SafeArea>
      <FormErrors errorMessages={errorMessages}/>
    </SafeArea>
  }

  if (profile === undefined) {
    return <></>
  }

  return (
    <SafeArea>
      <AvatarContainer>
        <AvatarPlaceholder/>
        <Spacer size='extraLarge' position='top'>
          <StyledText>{profile.email}</StyledText>
        </Spacer>
      </AvatarContainer>
      <ScrollView>
        <List.Section>
          <Divider/>
          <SettingsItem
            title={<StyledText>Change password</StyledText>}
            left={props => <SettingsItemIcon {...props} icon='security'/>}
            onPress={() => navigation.navigate('Change password')}
          />
          <Divider/>
          <SettingsItem
            title={<StyledText>Edit profile</StyledText>}
            left={props => (
              <SettingsItemIcon {...props} icon='edit'/>
            )}
            onPress={() => navigation.navigate('Edit profile')}
          />
          <Divider/>
          <SettingsItem
            title={<StyledText>Logout</StyledText>}
            left={props => <SettingsItemIcon {...props} icon='logout'/>}
            onPress={() => {
              void authenticator.signOut()
            }}
          />
          <Divider/>
        </List.Section>
      </ScrollView>
    </SafeArea>
  )
}

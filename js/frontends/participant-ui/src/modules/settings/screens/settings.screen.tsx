import React from 'react'
import { ScrollView } from 'react-native'
import { Divider, List } from 'react-native-paper'
import { Spacer } from '../../../common/components/spacer/spacer.component'
import { StyledText } from '../../../common/components/typography/styled-text.component'
import { SafeArea } from '../../../common/components/containers/safe-area.component'
import {
  AvatarContainer,
  AvatarPlaceholder,
  SettingsItem,
  SettingsItemIcon
} from './settings.styles'

export const SettingsScreen = (): JSX.Element => (
  <SafeArea>
    <AvatarContainer>
      <AvatarPlaceholder />
      <Spacer size='extraLarge' position='top'>
        <StyledText>participant@gmail.com</StyledText>
      </Spacer>
    </AvatarContainer>
    <ScrollView>
      <List.Section>
        <Divider />
        <SettingsItem
          title={<StyledText>Change password</StyledText>}
          left={props => <SettingsItemIcon {...props} icon='security' />}
          onPress={() => null}
        />
        <Divider />
        <SettingsItem
          title={<StyledText>Edit profile data</StyledText>}
          left={props => (
            <SettingsItemIcon {...props} icon='edit' />
          )}
          onPress={() => null}
        />
        <Divider />
        <SettingsItem
          title={<StyledText>Logout</StyledText>}
          left={props => <SettingsItemIcon {...props} icon='logout' />}
          onPress={() => null}
        />
        <Divider />
      </List.Section>
    </ScrollView>
  </SafeArea>
)

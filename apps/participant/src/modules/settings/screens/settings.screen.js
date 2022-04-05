import {ScrollView} from 'react-native';
import {Divider, List} from 'react-native-paper';

import {Spacer} from '../../../shared/components/spacer/spacer.component';
import {StyledText} from '../../../shared/components/typography/styled-text.component';
import {SafeArea} from '../../../shared/containers/safe-area.component';
import {
  AvatarContainer,
  AvatarPlaceholder,
  SettingsItem,
  SettingsItemIcon,
} from './settings.styles';

export const SettingsScreen = () => (
  <SafeArea>
    <AvatarContainer>
      <AvatarPlaceholder />
      <Spacer size="extraLarge" position="top">
        <StyledText>participant@gmail.com</StyledText>
      </Spacer>
    </AvatarContainer>
    <ScrollView>
      <List.Section>
        <Divider />
        <SettingsItem
          title={<StyledText>Change password</StyledText>}
          left={props => <SettingsItemIcon {...props} icon="security" />}
          onPress={() => null}
        />
        <Divider />
        <SettingsItem
          title={<StyledText>Edit profile data</StyledText>}
          left={props => (
            <SettingsItemIcon {...props} icon="square-edit-outline" />
          )}
          onPress={() => null}
        />
        <Divider />
        <SettingsItem
          title={<StyledText>Logout</StyledText>}
          left={props => <SettingsItemIcon {...props} icon="door" />}
          onPress={() => null}
        />
        <Divider />
      </List.Section>
    </ScrollView>
  </SafeArea>
);

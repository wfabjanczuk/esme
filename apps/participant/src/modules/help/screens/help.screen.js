import {useState} from 'react';
import {Checkbox} from 'react-native-paper';

import {StyledText} from '../../../shared/components/typography/styled-text.component';
import {SafeArea} from '../../../shared/containers/safe-area.component';
import {
  HelpFormButton,
  HelpFormCheckboxInputContainer,
  HelpFormInput,
} from './help.styles';

export const HelpScreen = () => {
  const [checked, setChecked] = useState(false);

  return (
    <SafeArea>
      <StyledText variant="title">Request help</StyledText>
      <HelpFormInput label="Event" />
      <HelpFormInput label="Problem description" />
      <HelpFormCheckboxInputContainer>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <StyledText variant="checkboxLabel">
          Start conversation with support team
        </StyledText>
      </HelpFormCheckboxInputContainer>
      <HelpFormButton icon="phone-outgoing" onPress={() => null}>
        Request help
      </HelpFormButton>
    </SafeArea>
  );
};

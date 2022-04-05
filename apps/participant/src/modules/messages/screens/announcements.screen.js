import React, {useContext} from 'react';

import {StyledText} from '../../../shared/components/typography/styled-text.component';
import {SafeArea} from '../../../shared/containers/safe-area.component';
import {MockContext} from '../../../shared/services/mock/mock.context';
import {ChatHistory} from '../components/chat-history/chat-history.component';
import {InputPlaceholderContainer} from './announcements.styles';

export const AnnouncementsScreen = () => {
  const {announcements} = useContext(MockContext);

  return (
    <SafeArea>
      <ChatHistory conversation={announcements} />
      <InputPlaceholderContainer>
        <StyledText variant="placeholder">
          Announcement does not support replies.
        </StyledText>
        <StyledText variant="placeholder">
          If you need help, use the Help tab.
        </StyledText>
      </InputPlaceholderContainer>
    </SafeArea>
  );
};

import React, {useContext, useState} from 'react';

import {SafeArea} from '../../../shared/containers/safe-area.component';
import {MockContext} from '../../../shared/services/mock/mock.context';
import {ChatHistory} from '../components/chat-history/chat-history.component';
import {ChatInput} from '../components/chat-input/chat-input.component';

export const ConversationScreen = () => {
  const {conversation: mockedConversation} = useContext(MockContext),
    [conversation, setConversation] = useState(mockedConversation),
    addMessage = message => {
      const currentTimestamp = Date.now() / 1000;

      setConversation([
        ...conversation,
        {
          sent: currentTimestamp,
          isOwn: true,
          content: message,
        },
      ]);
    };

  return (
    <SafeArea>
      <ChatHistory conversation={conversation} />
      <ChatInput addMessage={addMessage} />
    </SafeArea>
  );
};

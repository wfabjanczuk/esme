import React from 'react';
import {ScrollView} from 'react-native';

import {Spacer} from '../../../../shared/components/spacer/spacer.component';
import {ChatBubble} from './chat-bubble.component';

export const ChatHistory = ({conversation}) => (
  <ScrollView>
    {conversation.map(c => (
      <Spacer key={c.sent} position="top" size="medium">
        <ChatBubble isOwn={c.isOwn} content={c.content} />
      </Spacer>
    ))}
  </ScrollView>
);

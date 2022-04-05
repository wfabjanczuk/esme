import {useState} from 'react';

import {
  ChatAttachmentButton,
  ChatInputContainer,
  ChatSendButton,
  ChatTextInput,
} from './chat-input.styles';

export const ChatInput = ({addMessage}) => {
  const [message, setMessage] = useState(''),
    onPress = () => {
      if (!message.length) {
        return;
      }

      addMessage(message);
      setMessage('');
    };

  return (
    <ChatInputContainer>
      <ChatAttachmentButton onPress={() => null} />
      <ChatTextInput
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      <ChatSendButton onPress={onPress} />
    </ChatInputContainer>
  );
};

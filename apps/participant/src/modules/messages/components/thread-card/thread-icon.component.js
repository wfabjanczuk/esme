import Ionicons from 'react-native-vector-icons/Ionicons';

import {theme as globalTheme} from '../../../../theme';
import {ThreadCardIconContainer} from './thread-icon.styles';

export const ThreadIcon = props => {
  const {threadType, unread} = props,
    name =
      threadType === 'conversation' ? 'chatbubble-ellipses' : 'alert-circle',
    color = unread
      ? globalTheme.colors.ui.primary
      : globalTheme.colors.ui.secondary;

  return (
    <ThreadCardIconContainer>
      <Ionicons name={name} size={32} color={color} />
    </ThreadCardIconContainer>
  );
};

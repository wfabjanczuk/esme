import {TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper';

import {ThreadBadge} from './thread-badge.component';
import {ThreadCardTitle} from './thread-card-title.component';
import {ThreadCardContent} from './thread-card.styles';
import {ThreadDescription} from './thread-description.component';
import {ThreadIcon} from './thread-icon.component';

export const ThreadCard = ({thread, onPress}) => {
  const date = new Date(thread.updated * 1000);

  return (
    <TouchableOpacity onPress={onPress}>
      <ThreadCardContent
        title={
          <ThreadCardTitle eventName={thread.event} unread={thread.unread} />
        }
        description={<ThreadDescription date={date} unread={thread.unread} />}
        left={() => (
          <ThreadIcon threadType={thread.type} unread={thread.unread} />
        )}
        right={() => thread.unread && <ThreadBadge content="UNREAD" />}
      />
      <Divider inset />
    </TouchableOpacity>
  );
};

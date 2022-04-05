import {format} from 'date-fns';

import {StyledText} from '../../../../shared/components/typography/styled-text.component';

const formatThreadDateLastUpdated = date => {
  const today = new Date();

  if (today.toDateString() === date.toDateString()) {
    return format(date, 'HH:mm');
  }

  if (today.getFullYear() === date.getFullYear()) {
    return format(date, 'MMMM i');
  }

  return format(date, 'MMMM i, yyyy');
};

export const ThreadDescription = ({date, unread}) => {
  const textVariant = unread ? 'activeCaption' : 'caption';

  return (
    <StyledText variant={textVariant}>
      {formatThreadDateLastUpdated(date)}
    </StyledText>
  );
};

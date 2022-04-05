import {StyledText} from '../../../../shared/components/typography/styled-text.component';

export const ThreadCardTitle = ({eventName, unread}) => {
  const textVariant = unread ? 'activeBody' : 'body';

  return (
    <StyledText variant={textVariant} numberOfLines={1}>
      {eventName}
    </StyledText>
  );
};

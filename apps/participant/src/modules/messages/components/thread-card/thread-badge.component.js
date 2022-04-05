import {ThreadBadgeText, ThreadBadgeContainer} from './thread-badge.styles';

export const ThreadBadge = ({content}) => (
  <ThreadBadgeContainer>
    <ThreadBadgeText>{content}</ThreadBadgeText>
  </ThreadBadgeContainer>
);

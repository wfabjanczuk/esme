const organizerStyles = {
  backgroundColor: '#006494',
  color: '#FFFFFF'
}

const participantStyles = {
  backgroundColor: '#E8F1F2',
  color: '#13293D'
}

export const getChatBubbleStyle = (isOrganizer: boolean): Object => ({
  borderRadius: '8px',
  padding: '10px',
  minWidth: '13em',
  ...isOrganizer ? organizerStyles : participantStyles
})

export const getChatBubbleContainerStyle = (isOrganizer: boolean): Object => ({
  margin: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: isOrganizer ? 'flex-end' : 'flex-start',
  marginLeft: isOrganizer ? '80px' : '10px',
  marginRight: isOrganizer ? '10px' : '80px'
})

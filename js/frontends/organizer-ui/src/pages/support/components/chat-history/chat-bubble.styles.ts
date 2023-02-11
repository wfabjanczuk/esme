const organizerStyles = {
  backgroundColor: '#006494',
  color: '#FFFFFF',
  marginLeft: '80px'
}

const participantStyles = {
  backgroundColor: '#E8F1F2',
  color: '#13293D',
  marginRight: '80px'
}

export const getChatBubbleStyle = (isOrganizer: boolean): Object => ({
  borderRadius: '8px',
  margin: '10px',
  padding: '10px',
  ...isOrganizer ? organizerStyles : participantStyles
})

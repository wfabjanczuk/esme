import styled from 'styled-components/native'
import { colors } from '../../../../layout/colors'
import { PaperIconButton } from '../../../../common/components/overrides'
import { Platform } from 'react-native'

const isIos = Platform.OS === 'ios'

export const ChatInputContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-content: center;
`

export const ChatAttachmentButton = styled(PaperIconButton).attrs({
  iconColor: colors.text.inverse,
  size: 14,
  icon: 'add'
})`
  background-color: ${props => props.theme.colors.brand.primary};
  position: absolute;
  left: 8px;
  bottom: 13px;
  z-index: 9;
  margin: 0;
`

export const ChatSendButton = styled(PaperIconButton).attrs({
  iconColor: colors.brand.primary,
  size: 24,
  icon: 'send'
})`
  position: absolute;
  right: 5px;
  bottom: 9px;
  z-index: 9;
  margin: 0;
`

export const ChatTextInput = styled.TextInput.attrs({
  multiline: true
})`
  color: ${props => props.theme.colors.text.primary};
  border-width: 1px;
  border-color: ${props => props.theme.colors.ui.secondary};
  border-radius: 8px;
  flex-grow: 1;
  padding: 5px 10px;
  margin: ${isIos ? '13px' : '8px'} 46px;
  max-height: 100px;
`

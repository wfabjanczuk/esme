import styled from 'styled-components/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const FullScreenScrollView = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})``

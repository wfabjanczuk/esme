import React, { useContext, useLayoutEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { StyledText } from '../components/typography/styled-text.component'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Alert, AlertStoreContext, AlertType } from './alert-store.context'

const alertDisplayTime = 5000

export const AlertBar = (): JSX.Element => {
  const {
    state: { alerts },
    remove
  } = useContext(AlertStoreContext)
  const insets = useSafeAreaInsets()

  return <AlertBarContainer topOffset={insets.top}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} alert={a} remove={remove}/>
    )}
  </AlertBarContainer>
}

const AlertBarContainer = styled(View)<{ topOffset: number }>`
    top: ${props => props.topOffset}px;
    position: absolute;
    zIndex: 3;
    elevation: 3;
    width: 100%;
`

interface AlertBarElementProps {
  alert: Alert
  remove: (id: number) => void
}

const AlertBarElement = ({
  alert: {
    id,
    content,
    type
  },
  remove
}: AlertBarElementProps): JSX.Element => {
  useLayoutEffect(() => {
    setTimeout(() => remove(id), alertDisplayTime)
  }, [id, remove])

  return <ElementContainer type={type} onPress={() => remove(id)}>
    <StyledText variant='inverseBody'>{content}</StyledText>
  </ElementContainer>
}

interface ElementContainerProps {
  type: AlertType
  onPress: () => void
}

const ElementContainer = styled(TouchableOpacity).attrs(({
  type,
  onPress
}: ElementContainerProps) => ({
  type,
  onPress,
  shadowColor: 'black',
  elevation: 3,
  shadowOpacity: 0.5,
  shadowOffset: { height: 3 }
}))`
  flex: 1;
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[2]};
  padding: ${props => props.theme.spaces[2]};
  border-radius: ${props => props.theme.spaces[2]};
  backgroundColor: ${props => props.theme.colors.ui[props.type]};
`

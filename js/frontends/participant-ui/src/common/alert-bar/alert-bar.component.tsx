import React, { useContext } from 'react'
import { View } from 'react-native'
import { StyledText } from '../components/typography/styled-text.component'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { AlertStoreContext } from './alert-store.context'

export type AlertType = 'success' | 'error' | 'warning'

export const AlertBar = (): JSX.Element => {
  const { alerts } = useContext(AlertStoreContext)
  const insets = useSafeAreaInsets()

  return <AlertBarContainer topOffset={insets.top}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} type={a.type} content={a.content}/>
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
  type: AlertType
  content: string
}

const AlertBarElement = ({
  type,
  content
}: AlertBarElementProps): JSX.Element => {
  return <ElementContainer type={type}>
    <StyledText variant='inverseBody'>{content}</StyledText>
  </ElementContainer>
}

interface ElementContainerProps {
  type: AlertType
}

const ElementContainer = styled(View).attrs(({ type }: ElementContainerProps) => ({
  type,
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

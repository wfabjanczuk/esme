import React from 'react'
import { View } from 'react-native'
import { Spacer } from '../components/spacer/spacer.component'
import { StyledText } from '../components/typography/styled-text.component'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Card } from 'react-native-paper'

export const AlertBar = (): JSX.Element => {
  const insets = useSafeAreaInsets()
  const alerts = [
    {
      type: 'success' as AlertType,
      content: 'This is an error message'
    },
    {
      type: 'error' as AlertType,
      content: 'This is an error message'
    },
    {
      type: 'warning' as AlertType,
      content: 'This is an error message'
    },
    {
      type: 'success' as AlertType,
      content: 'This is an error message'
    },
    {
      type: 'error' as AlertType,
      content: 'This is an error message'
    },
    {
      type: 'warning' as AlertType,
      content: 'This is an error message'
    }
  ]

  return <View style={{
    position: 'absolute',
    top: insets.top,
    zIndex: 3,
    elevation: 3,
    width: '100%'
  }}>
    {alerts.map((a, i) =>
      <AlertBarElement key={i} type={a.type} content={a.content}/>
    )}
  </View>
}

export type AlertType = 'success' | 'error' | 'warning'

interface AlertBarElementProps {
  type: AlertType
  content: string
}

const AlertBarElement = ({
  type,
  content
}: AlertBarElementProps): JSX.Element => {
  return <AlertBarElementContainer type={type}>
    <Spacer size='medium' position='all'>
      <StyledText variant='inverseBody'>{content}</StyledText>
    </Spacer>
  </AlertBarElementContainer>
}

export const AlertBarElementContainer = styled(Card)<{ type: AlertType }>`
  flex: 1;
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[2]};
  padding: ${props => props.theme.spaces[0]};
  backgroundColor: ${props => props.theme.colors.ui[props.type]};
`

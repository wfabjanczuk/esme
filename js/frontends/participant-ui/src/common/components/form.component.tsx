import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { StyledText } from './typography/styled-text.component'
import { PaperTextInput } from './overrides'

export const DefaultForm = styled.View`
  margin: ${props => props.theme.spaces[1]} ${props => props.theme.spaces[0]};
`

export const DefaultTextInput = styled(PaperTextInput)`
  margin: ${props => props.theme.spaces[2]} ${props => props.theme.spaces[3]};
`

interface FormErrorsProps {
  errorMessages: string[]
}

export const FormErrors = ({ errorMessages }: FormErrorsProps): JSX.Element => {
  if (errorMessages.length === 0) {
    return <></>
  }

  return <View style={{
    display: 'flex',
    alignItems: 'center'
  }}>
    {errorMessages.map((m, i) => (
      <StyledText key={i} variant='error'>{m}</StyledText>
    ))}
  </View>
}

import React from 'react'
import { View } from 'react-native'
import { StyledText } from './typography/styled-text.component'

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

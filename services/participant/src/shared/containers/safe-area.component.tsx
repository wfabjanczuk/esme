import React from 'react'
import styled from 'styled-components/native'
import { SafeAreaView, ViewProps } from 'react-native'

const _SafeAreaView: React.FunctionComponent<ViewProps> = (props) =>
  <SafeAreaView {...props}/>

export const SafeArea = styled(_SafeAreaView)<ViewProps>`
  flex: 1;
  background-color: ${props => props.theme.colors.bg.primary};
`

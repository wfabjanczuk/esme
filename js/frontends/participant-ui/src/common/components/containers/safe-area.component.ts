import styled from 'styled-components/native'

export const SafeArea = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.bg.primary};
  flex: 1;
`

export const SafeAreaCentered = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.bg.primary};
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

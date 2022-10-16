import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { projectName } from '@esme_frontend/common'

export const App = (): JSX.Element => (
  <View style={styles.container}>
    <Text>Project name: {projectName}</Text>
    <Text>Open up App.tsx to start working on your app!</Text>
    <StatusBar style="auto"/>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

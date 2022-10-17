import React from 'react'
import {
  Avatar,
  Badge,
  Button,
  IconButton, List,
  TextInput
} from 'react-native-paper'

export const PaperAvatarIcon: React.FunctionComponent<React.ComponentProps<typeof Avatar.Icon>> = (props) =>
  <Avatar.Icon {...props}/>

export const PaperBadge: React.FunctionComponent<React.ComponentProps<typeof Badge>> = (props) =>
  <Badge {...props}/>

export const PaperButton: React.FunctionComponent<React.ComponentProps<typeof Button>> = (props) =>
  <Button {...props}/>

export const PaperIconButton: React.FunctionComponent<React.ComponentProps<typeof IconButton>> = (props) =>
  <IconButton {...props}/>

export const PaperListIcon: React.FunctionComponent<React.ComponentProps<typeof List.Icon>> = (props) =>
  <List.Icon {...props}/>

export const PaperListItem: React.FunctionComponent<React.ComponentProps<typeof List.Item>> = (props) =>
  <List.Item {...props}/>

export const PaperTextInput: React.FunctionComponent<React.ComponentProps<typeof TextInput>> = (props) =>
  <TextInput {...props}/>

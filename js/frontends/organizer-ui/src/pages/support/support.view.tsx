import React, { Fragment, useState } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { Chats } from './chats.component'
import { Participant } from './participant.components'
import Divider from '@mui/material/Divider'
import { Conversation } from './components/conversation.component'

export const SupportView = (): JSX.Element => {
  const [activeChatId, setActiveChatId] = useState<string>('')

  return <Fragment>
    <Header title='Live support'/>
    <Box sx={{
      display: 'flex',
      overflow: 'auto',
      height: '100%'
    }}>
      <Chats activeChatId={activeChatId} setActiveChatId={setActiveChatId}/>
      <Divider orientation='vertical'/>
      <Conversation chatId={activeChatId}/>
      <Divider orientation='vertical'/>
      <Participant/>
    </Box>
  </Fragment>
}

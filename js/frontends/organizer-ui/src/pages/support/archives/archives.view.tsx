import React, { Fragment, useState } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { Chats } from './chats.component'
import Divider from '@mui/material/Divider'
import { Messages } from './messages.component'

export const ArchivesView = (): JSX.Element => {
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
      <Messages chatId={activeChatId}/>
      <Divider orientation='vertical'/>
    </Box>
  </Fragment>
}

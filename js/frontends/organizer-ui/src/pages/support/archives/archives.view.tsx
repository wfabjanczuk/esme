import React, { Fragment, useState } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { ArchivedChats } from './archived-chats.component'
import Divider from '@mui/material/Divider'
import { Messages } from './messages.component'
import { useChatsList } from './chats-list.hook'
import { InfoPanel } from '../components/info-bar/info-panel.component'

export const ArchivesView = (): JSX.Element => {
  const [activeChatId, setActiveChatId] = useState<string>('')
  const { chats } = useChatsList()
  const activeChat = chats.find((chat) => chat.id === activeChatId)

  return <Fragment>
    <Header title='Live support'/>
    <Box sx={{
      display: 'flex',
      overflow: 'auto',
      height: '100%'
    }}>
      <ArchivedChats
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />
      <Divider orientation='vertical'/>
      <Messages activeChatId={activeChatId}/>
      <Divider orientation='vertical'/>
      <InfoPanel activeChat={activeChat}/>
    </Box>
  </Fragment>
}

import React, { Fragment, useContext, useEffect, useState } from 'react'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { Chats } from './chats.component'
import { Participant } from './participant.components'
import Divider from '@mui/material/Divider'
import { Conversation } from './components/conversation.component'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { AlertStoreContext } from '../../common/alert-bar/alert-store.context'

export const SupportView = (): JSX.Element => {
  const [activeChatId, setActiveChatId] = useState<string>('')
  const alertStore = useContext(AlertStoreContext)
  const messenger = useContext(MessengerContext)

  useEffect(() => {
    if (!messenger.isInitialized()) {
      alertStore.add('error', 'WebSocket connection could not be initialized')
    }
  }, [messenger.isInitialized()])

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

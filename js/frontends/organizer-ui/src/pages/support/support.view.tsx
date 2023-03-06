import React, { Fragment, useContext, useState } from 'react'
import Header from '../../layout/header'
import { Alert, Box } from '@mui/material'
import { Chats } from './chats.component'
import { Participant } from './participant.components'
import Divider from '@mui/material/Divider'
import { Conversation } from './components/conversation.component'
import { MessengerContext } from '../../common/messenger/messenger.context'
import { styles } from '../../layout/styles'

export const SupportView = (): JSX.Element => {
  const [activeChatId, setActiveChatId] = useState<string>('')
  const messenger = useContext(MessengerContext)

  if (!messenger.isInitialized()) {
    return <Fragment>
      <Header title='Live support'/>
      <Box style={styles.layout.root}>
        <Box component='main' sx={styles.layout.content}>
          <Alert variant='filled' severity='error' sx={styles.layout.fullWidth}>
            WebSocket connection could not be initialized
          </Alert>
        </Box>
      </Box>
    </Fragment>
  }

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

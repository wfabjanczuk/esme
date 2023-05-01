import React, { Fragment, useState } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { ArchivesChats } from './archives-chats.component'
import Divider from '@mui/material/Divider'
import { Messages } from './messages.component'
import { useNewArchives } from './archives.hook'
import { ArchivesInfoPanel } from './archives-info-panel.component'
import { ArchivesContext } from './archives.context'
import { styles } from '../../../layout/styles'

export const ArchivesView = (): JSX.Element => {
  const { archives } = useNewArchives()
  const [activeChatId, setActiveChatId] = useState<string>('')

  if (!archives.hasState()) {
    return <></>
  }

  return <Fragment>
    <Header title='Archives'/>
    <Box sx={styles.messenger.container}>
      <ArchivesContext.Provider value={archives}>
        <ArchivesChats
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
        <Divider orientation='vertical'/>
        <Messages activeChatId={activeChatId}/>
        <Divider orientation='vertical'/>
        <ArchivesInfoPanel activeChatId={activeChatId}/>
      </ArchivesContext.Provider>
    </Box>
  </Fragment>
}

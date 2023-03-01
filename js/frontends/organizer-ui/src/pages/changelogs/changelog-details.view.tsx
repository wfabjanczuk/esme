import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'
import { JsonViewer } from '@textea/json-viewer'
import { useChangelog } from './changelog.entity'

export const ChangelogDetailsView = (): JSX.Element => {
  const { id: idFromRoute } = useParams()
  const id = idFromRoute === undefined ? undefined : parseInt(idFromRoute, 10)

  return <Fragment>
    <Header title='Event'/>
    <Box component='main' sx={styles.layout.content}>
      <AlertBar size='medium'/>
      {id !== undefined
        ? <ChangelogDetailsCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const ChangelogDetailsCard = ({ id }: { id: number }): JSX.Element => {
  const { errorMessages, entity } = useChangelog(id)
  console.log(errorMessages)

  if (entity === undefined) {
    return <></>
  }

  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Changelog details' entityName='changelog' listUrl='/changelogs'/>
    <JsonViewer value={entity.valueAfter}/>
  </Paper>
}

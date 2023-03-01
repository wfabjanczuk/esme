import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { AlertBar } from '../../common/alert-bar/alert-bar.component'
import { Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/card-title.component'
import { JsonViewer } from '@textea/json-viewer'
import { useChangelog } from './changelog.entity'
import { parseDateTimeLabel } from '../../common/utils'

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
  const { entity: changelog } = useChangelog(id)

  if (changelog === undefined) {
    return <></>
  }

  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Changelog details' entityName='changelog' listUrl='/changelogs'/>

    <ChangelogField name='action' value={changelog.type} bold={true}/>
    <ChangelogField name='id' value={changelog.id}/>
    <ChangelogField name='entity' value={`${changelog.entityClass} ${changelog.entityId}`}/>
    <ChangelogField name='user id' value={changelog.userId}/>
    <ChangelogField name='time' value={parseDateTimeLabel(changelog.changedAt)}/>

    {changelog.valueAfter == null
      ? <></>
      : <Box sx={{ backgroundColor: '#f8fafa', my: 2, p: 2 }}>
        <JsonViewer rootName={false} value={JSON.parse(changelog.valueAfter)}/>
      </Box>
    }
  </Paper>
}

interface ChangelogFieldProps {
  name: string
  value: number | string | undefined
  bold?: boolean
}

const ChangelogField = ({ name, value, bold = false }: ChangelogFieldProps): JSX.Element => {
  const fontWeight = bold ? 'bolder' : 'normal'

  return <Box>
    <Box sx={{ width: '80px', display: 'inline-block' }}>
      <Typography variant='overline' fontWeight={fontWeight}>{name}:</Typography>
    </Box>
    <Typography component='span' fontWeight={fontWeight}>{value}</Typography>
  </Box>
}

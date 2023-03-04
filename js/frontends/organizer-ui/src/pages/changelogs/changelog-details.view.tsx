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
import { useUserDetails } from '../users/user.entity'

export const ChangelogDetailsView = (): JSX.Element => {
  const { changelogId: changelogIdFromRoute } = useParams()
  const id = changelogIdFromRoute === undefined ? undefined : parseInt(changelogIdFromRoute, 10)

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
    <CardTitle title='Changelog details' redirectLabel='Go to changelogs list' redirectUrl='/changelogs'/>

    <ChangelogField name='action' value={changelog.type} bold={true}/>
    <ChangelogField name='id' value={changelog.id}/>
    <ChangelogField name='entity' value={`${changelog.entityClass} ${changelog.entityId}`}/>

    {changelog.userId === undefined
      ? <ChangelogField name='user' value='unknown user'/>
      : <ChangelogUser userId={changelog.userId}/>
    }
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

interface ChangelogUserProps {
  userId: number
}

const ChangelogUser = ({ userId }: ChangelogUserProps): JSX.Element => {
  const { entity: user } = useUserDetails(userId)

  if (user === undefined) {
    return <ChangelogField name='user id' value={userId}/>
  }

  return <ChangelogField name='user' value={`${user.firstName} ${user.lastName}`}/>
}

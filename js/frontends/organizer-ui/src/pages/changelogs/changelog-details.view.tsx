import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { Box, Typography } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/components/card-title.component'
import { JsonViewer } from '@textea/json-viewer'
import { useChangelogDetails } from './changelog.entity'
import { parseDateTimeLabel } from '../../common/utils'
import { UserRoleLabels, useUserDetails } from '../users/user.entity'
import { FormErrors } from '../../common/components/form-errors.component'

export const ChangelogDetailsView = (): JSX.Element => {
  const { changelogId: changelogIdFromRoute } = useParams()
  const id = changelogIdFromRoute === undefined ? undefined : parseInt(changelogIdFromRoute, 10)

  return <Fragment>
    <Header title='Changelog'/>
    <Box component='main' sx={styles.layout.content}>
      {id !== undefined
        ? <ChangelogDetailsCard id={id}/>
        : <></>
      }
    </Box>
  </Fragment>
}

const ChangelogDetailsCard = ({ id }: { id: number }): JSX.Element => {
  const {
    errorMessages,
    entity: changelog
  } = useChangelogDetails(id)

  if (changelog === undefined) {
    return <Paper sx={styles.layout.cardMedium}>
      <CardTitle title='Changelog details' redirectLabel='Go to changelogs list' redirectUrl='/changelogs'/>
      <FormErrors errorMessages={errorMessages}/>
    </Paper>
  }

  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Changelog details' redirectLabel='Go to changelogs list' redirectUrl='/changelogs'/>
    <ChangelogField name='Action' value={changelog.type}/>
    <ChangelogField name='Entity' value={`${changelog.entityClass} ${changelog.entityId}`}/>
    {changelog.userId === undefined
      ? <ChangelogField name='User' value='unknown user'/>
      : <ChangelogUser userId={changelog.userId}/>
    }
    <ChangelogField name='Time' value={parseDateTimeLabel(changelog.changedAt)}/>
    {changelog.valueAfter == null
      ? <></>
      : <Box sx={{
        backgroundColor: '#f8fafa',
        my: 2,
        p: 2
      }}>
        <JsonViewer rootName={false} value={JSON.parse(changelog.valueAfter)}/>
      </Box>
    }
  </Paper>
}

interface ChangelogFieldProps {
  name: string
  value: number | string | undefined
}

const ChangelogField = ({
  name,
  value
}: ChangelogFieldProps): JSX.Element => {
  return <Box>
    <Box sx={{
      width: '80px',
      display: 'inline-block'
    }}>
      <Typography fontWeight='bold'>{name}:</Typography>
    </Box>
    <Typography component='span'>{value}</Typography>
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

  return <ChangelogField name='User' value={`${user.firstName} ${user.lastName} (${UserRoleLabels[user.role]})`}/>
}

import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styles } from '../../../layout/styles'
import { CardTitle } from '../../../common/components/card-title.component'
import { useParams } from 'react-router-dom'
import { AddCommentForm } from './add-comment.form'

export const AddCommentView = (): JSX.Element => {
  const { issueId: issueIdFromRoute } = useParams()
  const issueId = issueIdFromRoute === undefined ? undefined : parseInt(issueIdFromRoute, 10)

  return <Fragment>
    <Header title='Issue comment'/>
    <Box component='main' sx={styles.layout.content}>
      {issueId !== undefined
        ? <CreateCommentCard issueId={issueId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface CreateCommentCardProps {
  issueId: number
}

const CreateCommentCard = ({ issueId }: CreateCommentCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Add comment' redirectLabel='Go to issue' redirectUrl={`/issues/${issueId}`}/>
    <AddCommentForm issueId={issueId}/>
  </Paper>
}

import { useParams } from 'react-router-dom'
import React, { Fragment } from 'react'
import Header from '../../../layout/header'
import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../../common/components/card-title.component'
import { EditCommentForm } from './edit-comment.form'

export const EditCommentView = (): JSX.Element => {
  const {
    issueId: issueIdFromRoute,
    commentId: commentIdFromRoute
  } = useParams()
  const issueId = issueIdFromRoute === undefined ? undefined : parseInt(issueIdFromRoute, 10)
  const commentId = commentIdFromRoute === undefined ? undefined : parseInt(commentIdFromRoute, 10)

  return <Fragment>
    <Header title='Issue comment'/>
    <Box component='main' sx={styles.layout.content}>
      {issueId !== undefined && commentId !== undefined
        ? <EditCommentCard issueId={issueId} commentId={commentId}/>
        : <></>
      }
    </Box>
  </Fragment>
}

interface EditCommentCardProps {
  issueId: number
  commentId: number
}

const EditCommentCard = ({ issueId, commentId }: EditCommentCardProps): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit comment' redirectLabel='Go to issue' redirectUrl={`/issues/${issueId}`}/>
    <EditCommentForm issueId={issueId} commentId={commentId}/>
  </Paper>
}

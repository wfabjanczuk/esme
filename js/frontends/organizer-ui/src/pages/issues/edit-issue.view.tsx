import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../layout/header'
import { Box } from '@mui/material'
import { styles } from '../../layout/styles'
import Paper from '@mui/material/Paper'
import { CardTitle } from '../../common/components/card-title.component'
import { EditIssueForm } from './edit-issue.form'
import { CardFooter } from '../../common/components/card-footer.component'
import { CommentsList } from './comments/comments-list.component'

export const EditIssueView = (): JSX.Element => {
  const { issueId: issueIdFromRoute } = useParams()
  const id = issueIdFromRoute === undefined ? undefined : parseInt(issueIdFromRoute, 10)

  return <Fragment>
    <Header title='Issue'/>
    <Box component='main' sx={styles.layout.content}>
      {id !== undefined
        ? <Fragment>
          <EditIssueCard id={id}/>
          <IssueCommentsCard issueId={id}/>
        </Fragment>
        : <></>
      }
    </Box>
  </Fragment>
}

const EditIssueCard = ({ id }: { id: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Edit issue' redirectLabel='Go to issues list' redirectUrl='/issues'/>
    <EditIssueForm id={id}/>
  </Paper>
}

const IssueCommentsCard = ({ issueId }: { issueId: number }): JSX.Element => {
  return <Paper sx={styles.layout.cardMedium}>
    <CardTitle title='Issue comments'/>
    <CommentsList issueId={issueId}/>
    <CardFooter redirectLabel='Add comment' redirectUrl={`/issues/${issueId}/comments/add`}/>
  </Paper>
}

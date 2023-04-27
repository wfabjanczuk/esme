import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import React, { useContext } from 'react'
import { useCommentsList } from './comment.entity'
import { AlertStoreContext } from '../../../common/alert-bar/alert-store.context'
import { useProfileDetails } from '../../profile/profile.hook'
import { CommentDetailsComponent } from './comment-details.component'

interface CommentsListProps {
  issueId: number
}

export const CommentsList = ({ issueId }: CommentsListProps): JSX.Element => {
  const alertStore = useContext(AlertStoreContext)
  const {
    errorMessages: commentErrors,
    list: comments
  } = useCommentsList(issueId)
  const {
    errorMessages: profileErrors,
    profile
  } = useProfileDetails()
  const errorMessages = [...commentErrors, ...profileErrors]

  if (errorMessages.length > 0) {
    errorMessages.forEach(e => alertStore.add('error', e))
    return <></>
  }
  if (profile === undefined) {
    return <></>
  }

  return <Box style={styles.comments.list}>
    {comments.map(c => <CommentDetailsComponent
      key={`comment_${c.id}`}
      issueId={issueId}
      comment={c}
      profile={profile}
    />)}
  </Box>
}

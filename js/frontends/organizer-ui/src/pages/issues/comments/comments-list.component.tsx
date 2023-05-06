import { Box } from '@mui/material'
import { styles } from '../../../layout/styles'
import React from 'react'
import { useCommentsList } from './comment.entity'
import { useProfileDetails } from '../../profile/profile.hook'
import { CommentDetailsComponent } from './comment-details.component'

interface CommentsListProps {
  issueId: number
}

export const CommentsList = ({ issueId }: CommentsListProps): JSX.Element => {
  const { list: comments } = useCommentsList(issueId)
  const { profile } = useProfileDetails()

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

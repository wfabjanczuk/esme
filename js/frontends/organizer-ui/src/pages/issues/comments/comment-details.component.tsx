import { Comment } from './comment.entity'
import { Profile } from '../../profile/profile.entity'
import React from 'react'
import { UserRoleLabels, useUserDetails } from '../../users/user.entity'
import { Box, Button, Divider, Typography } from '@mui/material'
import { styles } from '../../../layout/styles'
import { parseDateTimeLabel } from '../../../common/utils'
import { NavLink } from 'react-router-dom'
import { Edit } from '@mui/icons-material'

interface CommentDetailsComponentProps {
  issueId: number
  comment: Comment
  profile: Profile
}

export const CommentDetailsComponent = ({
  issueId,
  comment,
  profile
}: CommentDetailsComponentProps): JSX.Element => {
  const { entity: user } = useUserDetails(comment.authorId)

  if (user === undefined) {
    return <></>
  }

  return <Box>
    <Divider/>
    <Box sx={styles.comments.commentInfo}>
      <Box sx={styles.comments.authorHeader}>
        <Typography variant='body2'>
          <b>Author:</b>
        </Typography>
        <Typography variant='body2'>
          {user.firstName} {user.lastName} ({UserRoleLabels[user.role]})
        </Typography>
      </Box>
      <Box sx={styles.comments.timeHeader}>
        <Typography variant='body2'>
          <b>Created:</b>
        </Typography>
        <Typography variant='body2'>
          {parseDateTimeLabel(comment.timeCreated)}
        </Typography>
      </Box>
    </Box>
    <Typography sx={styles.comments.content}>{comment.content}</Typography>
    {profile.id === comment.authorId &&
      <Box sx={styles.comments.editButton}>
        <NavLink to={`/issues/${issueId}/comments/${comment.id}`} style={styles.links.component}>
          <Button color='primary' startIcon={<Edit/>}>
            Edit
          </Button>
        </NavLink>
      </Box>
    }
  </Box>
}

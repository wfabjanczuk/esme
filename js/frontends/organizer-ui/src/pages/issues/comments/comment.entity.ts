import { ListHook, useList } from '../../../common/hooks/list.hook'
import { config } from '../../../app/config'
import { CreateHook, useCreate } from '../../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../../common/hooks/edit.hook'

export interface Comment {
  id: number
  content: string
  issueId: number
  authorId: number
  timeCreated: string
}

const commentsApiUrl = `${config.organizerApiUrl}/agency/comments`
const issuesViewUrl = '/issues'

export const useCreateComment = (issueId: number): CreateHook =>
  useCreate(commentsApiUrl, `${issuesViewUrl}/${issueId}`)

export const useEditComment = (commentId: number, issueId: number): EditHook<Comment> =>
  useEdit<Comment>(commentId, commentsApiUrl, `${issuesViewUrl}/${issueId}`)

export const useCommentsList = (issueId: number): ListHook<Comment> =>
  useList<Comment>(`${commentsApiUrl}?issueId=${issueId}`)

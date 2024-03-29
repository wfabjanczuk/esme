import { ListHook, useList } from '../../common/hooks/list.hook'
import { config } from '../../app/config'
import { CreateHook, useCreate } from '../../common/hooks/create.hook'
import { EditHook, useEdit } from '../../common/hooks/edit.hook'

export enum IssueStatus {
  toDo = 'to_do',
  inProgress = 'in_progress',
  resolved = 'resolved',
  cancelled = 'cancelled',
}

export const IssueStatusesList = [IssueStatus.toDo, IssueStatus.inProgress, IssueStatus.resolved, IssueStatus.cancelled]
export const IssueStatusLabels = {
  [IssueStatus.toDo]: 'To do',
  [IssueStatus.inProgress]: 'In progress',
  [IssueStatus.resolved]: 'Resolved',
  [IssueStatus.cancelled]: 'Cancelled'
}

export enum IssuePriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export const IssuePrioritiesList = [IssuePriority.low, IssuePriority.medium, IssuePriority.high]
export const IssuePriorityLabels = {
  [IssuePriority.low]: 'Low',
  [IssuePriority.medium]: 'Medium',
  [IssuePriority.high]: 'High'
}

export interface Issue {
  id: number
  name: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  timeCreated: string
  timeClosed?: string
  authorId: number
  eventId: number
}

const issuesApiUrl = `${config.organizerApiUrl}/agency/issues`
const issuesViewUrl = '/issues'

export const useCreateIssue = (): CreateHook => useCreate(issuesApiUrl, issuesViewUrl)

export const useEditIssue = (id: number): EditHook<Issue> =>
  useEdit<Issue>(id, issuesApiUrl, issuesViewUrl)

export const useIssueDetails = (id: number): Pick<EditHook<Issue>, 'errorMessages' | 'entity'> =>
  useEdit<Issue>(id, issuesApiUrl, '')

export const useIssuesList = (): ListHook<Issue> =>
  useList<Issue>(issuesApiUrl)

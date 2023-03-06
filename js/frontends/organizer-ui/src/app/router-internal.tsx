import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorView } from './error.view'
import { PlaceholderView } from './placeholder-view'
import { Layout } from '../layout/layout'
import { EditAgencyView } from '../pages/agency/edit-agency.view'
import { SupportView } from '../pages/support/support.view'
import { EventsView } from '../pages/events/events.view'
import { EditEventView } from '../pages/events/edit-event.view'
import { AddEventView } from '../pages/events/add-event.view'
import { UsersView } from '../pages/users/users.view'
import { AddUserView } from '../pages/users/add-user.view'
import { EditUserView } from '../pages/users/edit-user.view'
import { ChangelogsView } from '../pages/changelogs/changelogs.view'
import { ChangelogDetailsView } from '../pages/changelogs/changelog-details.view'
import { AddContactView } from '../pages/events/contacts/add-contact.view'
import { EditContactView } from '../pages/events/contacts/edit-contact.view'
import { AddAnnouncementView } from '../pages/events/announcements/add-announcement.view'
import { EditAnnouncementView } from '../pages/events/announcements/edit-announcement.view'
import { IssuesView } from '../pages/issues/issues.view'
import { AddIssueView } from '../pages/issues/add-issue.view'
import { EditIssueView } from '../pages/issues/edit-issue.view'
import { AddCommentView } from '../pages/issues/comments/add-comment.view'
import { EditCommentView } from '../pages/issues/comments/edit-comment.view'

export const RouterInternal = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    errorElement: <ErrorView/>,
    children: [
      {
        errorElement: <ErrorView/>,
        children: [
          {
            index: true,
            element: <EditAgencyView/>
          },
          {
            path: 'users',
            element: <UsersView/>
          },
          {
            path: 'users/add',
            element: <AddUserView/>
          },
          {
            path: 'users/:userId',
            element: <EditUserView/>
          },
          {
            path: 'events',
            element: <EventsView/>
          },
          {
            path: 'events/add',
            element: <AddEventView/>
          },
          {
            path: 'events/:eventId',
            element: <EditEventView/>
          },
          {
            path: 'events/:eventId/contacts/add',
            element: <AddContactView/>
          },
          {
            path: 'events/:eventId/contacts/:contactId',
            element: <EditContactView/>
          },
          {
            path: 'events/:eventId/announcements/add',
            element: <AddAnnouncementView/>
          },
          {
            path: 'events/:eventId/announcements/:announcementId',
            element: <EditAnnouncementView/>
          },
          {
            path: 'issues',
            element: <IssuesView/>
          },
          {
            path: 'issues/add',
            element: <AddIssueView/>
          },
          {
            path: 'issues/:issueId',
            element: <EditIssueView/>
          },
          {
            path: 'issues/:issueId/comments/add',
            element: <AddCommentView/>
          },
          {
            path: 'issues/:issueId/comments/:commentId',
            element: <EditCommentView/>
          },
          {
            path: 'changelogs',
            element: <ChangelogsView/>
          },
          {
            path: 'changelogs/:changelogId',
            element: <ChangelogDetailsView/>
          },
          {
            path: 'support',
            element: <SupportView/>
          },
          {
            path: 'profile',
            element: <PlaceholderView text={'Profile'}/>
          },
          {
            path: 'error',
            element: <PlaceholderView text={'Error'}/>
          }
        ]
      }
    ]
  }
])

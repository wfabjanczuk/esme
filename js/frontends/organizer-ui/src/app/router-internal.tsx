import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorView } from './error.view'
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
import { ProfileView } from '../pages/profile/profile.view'
import { AdminUsersView } from '../pages/admin-users/admin-users.view'
import { AdminChangelogsView } from '../pages/admin-changelogs/admin-changelogs.view'
import { AdminAgenciesView } from '../pages/admin-agencies/admin-agencies.view'
import { AdminAgencyDetailsView } from '../pages/admin-agencies/admin-agency-details.view'
import { AddAdminUserView } from '../pages/admin-users/add-admin-user.view'
import { EditAdminUserView } from '../pages/admin-users/edit-admin-user.view'
import { AdminChangelogDetailsView } from '../pages/admin-changelogs/admin-changelog-details.view'

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
            element: <ProfileView/>
          },
          {
            path: 'agency',
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
            element: <ProfileView/>
          },
          {
            path: 'admin/agencies',
            element: <AdminAgenciesView/>
          },
          {
            path: 'admin/agencies/:agencyId',
            element: <AdminAgencyDetailsView/>
          },
          {
            path: 'admin/users',
            element: <AdminUsersView/>
          },
          {
            path: 'admin/users/add',
            element: <AddAdminUserView/>
          },
          {
            path: 'admin/users/:userId',
            element: <EditAdminUserView/>
          },
          {
            path: 'admin/changelogs',
            element: <AdminChangelogsView/>
          },
          {
            path: 'admin/changelogs/:changelogId',
            element: <AdminChangelogDetailsView/>
          }
        ]
      }
    ]
  }
])

import { useProfileDetails } from '../../pages/profile/profile.hook'
import { ErrorView } from '../../app/error.view'
import React from 'react'
import { UserRole } from '../../pages/users/user.entity'

const withAuth = (roles: UserRole[]) => <P extends object> (Component: React.ComponentType<P>): React.FC<P> =>
  (props: P): JSX.Element => {
    const { profile } = useProfileDetails()

    if (profile === undefined) {
      return <></>
    }

    const isAdmin = roles.includes(profile.role)
    if (!isAdmin) {
      return <ErrorView errorMessages={['You are not authorized to view this page']}/>
    }

    return <Component {...props}/>
  }

export const withSuperAdminAuth = withAuth([UserRole.superAdmin])
export const withAdminAuth = withAuth([UserRole.superAdmin, UserRole.admin])

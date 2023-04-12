import { useProfileDetails } from '../pages/profile/profile.hook'
import { ErrorView } from '../app/error.view'
import React from 'react'

export const withAdminAuth = <P extends object> (Component: React.ComponentType<P>): React.FC<P> =>
  (props: P): JSX.Element => {
    const {
      profile,
      isAdmin
    } = useProfileDetails()

    if (profile === undefined) {
      return <></>
    }

    if (!isAdmin) {
      return <ErrorView errorMessages={['You are not authorized to view this page']}/>
    }

    return <Component {...props}/>
  }

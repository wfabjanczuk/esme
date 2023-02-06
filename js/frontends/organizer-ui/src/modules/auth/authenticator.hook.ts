import { useEffect, useState } from 'react'
import { Authenticator } from './authenticator.context'

export const useNewAuthenticator = (): Authenticator => {
  const [authenticator, setAuthenticator] = useState<Authenticator>(new Authenticator())

  useEffect(() => {
    setAuthenticator(new Authenticator(setAuthenticator))
  }, [])

  return authenticator
}

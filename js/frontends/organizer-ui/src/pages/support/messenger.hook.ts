import { useContext, useEffect, useState } from 'react'
import { Messenger } from './messenger.context'
import { AuthenticatorContext } from '../../common/authenticator/authenticator.context'
import { AlertStoreContext } from '../../common/alert-bar/alert-store.context'

export const useNewMessenger = (): Messenger => {
  const [messenger, setMessenger] = useState<Messenger>(new Messenger())
  const { authorizationHeader } = useContext(AuthenticatorContext)
  const alertStore = useContext(AlertStoreContext)

  useEffect(() => {
    setMessenger(new Messenger(setMessenger, alertStore, authorizationHeader))
  }, [])

  useEffect(() => {
    if (messenger.hasState()) {
      messenger.initialize()
    }
  }, [messenger.hasState()])

  return messenger
}

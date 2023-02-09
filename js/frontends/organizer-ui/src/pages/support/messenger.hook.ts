import { useEffect, useState } from 'react'
import { Messenger } from './messenger.context'

export const useNewMessenger = (): Messenger => {
  const [messenger, setMessenger] = useState<Messenger>(new Messenger())

  useEffect(() => {
    setMessenger(new Messenger(setMessenger))
  }, [])

  return messenger
}

import { useEffect, useState } from 'react'
import { AlertStore } from './alert-store.context'

export const useNewAlertStore = (): AlertStore => {
  const [alertStore, setAlertStore] = useState<AlertStore>(new AlertStore())

  useEffect(() => {
    setAlertStore(new AlertStore(setAlertStore))
  }, [])

  return alertStore
}

import { useEffect, useState } from 'react'
import { AlertStore } from './alert-store.context'

export const useNewAlertStore = (): AlertStore => {
  const [alertBar, setAlertBar] = useState<AlertStore>(new AlertStore())

  useEffect(() => {
    setAlertBar(new AlertStore(setAlertBar))
  }, [])

  return alertBar
}

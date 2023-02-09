import { useEffect, useState } from 'react'
import { AlertBar } from './alert-bar.context'

export const useNewAlertBar = (): AlertBar => {
  const [alertBar, setAlertBar] = useState<AlertBar>(new AlertBar())

  useEffect(() => {
    setAlertBar(new AlertBar(setAlertBar))
  }, [])

  return alertBar
}

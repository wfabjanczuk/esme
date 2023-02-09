import React from 'react'
import { AlertColor } from '@mui/material/Alert/Alert'

const emptySetState = (): void => {
}
const alertDisplayTime = 5000

interface Alert {
  type: AlertColor
  content: string
}

export class AlertStore {
  constructor (
    private readonly setState: (alertStore: AlertStore) => void = emptySetState,
    public readonly alerts: Alert[] = []
  ) {
  }

  isInitialized (): boolean {
    return this.setState !== emptySetState
  }

  add (type: AlertColor, content: string): void {
    this.alerts.push({
      type,
      content
    })
    setTimeout(() => {
      this.alerts.shift()
      this.update()
    }, alertDisplayTime)
    this.update()
  }

  private update (): void {
    this.setState(new AlertStore(this.setState, this.alerts))
  }
}

export const AlertStoreContext = React.createContext<AlertStore>(new AlertStore())

import React, { Dispatch, SetStateAction } from 'react'
import { AlertType } from './alert-bar.component'

const emptySetState = (): void => {}
const alertDisplayTime = 5000

interface Alert {
  type: AlertType
  content: string
}

export class AlertStore {
  constructor (
    private readonly setState: Dispatch<SetStateAction<AlertStore>> = emptySetState,
    public readonly alerts: Alert[] = []
  ) {
  }

  hasState (): boolean {
    return this.setState !== emptySetState
  }

  add (type: AlertType, content: string): void {
    this.alerts.push({
      type,
      content
    })
    setTimeout(() => {
      this.alerts.shift()
      this.refreshState()
    }, alertDisplayTime)
    this.refreshState()
  }

  private refreshState (): void {
    this.setState(new AlertStore(this.setState, this.alerts))
  }
}

export const AlertStoreContext = React.createContext<AlertStore>(new AlertStore())

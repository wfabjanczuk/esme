import React, { Reducer } from 'react'

export type AlertType = 'success' | 'error' | 'warning'

export interface Alert {
  id: number
  type: AlertType
  content: string
}

export interface AlertStore {
  state: AlertStoreState
  add: (type: AlertType, content: string) => void
  remove: (id: number) => void
}

interface AlertStoreState {
  nextId: number
  alerts: Alert[]
}

interface AddAction {
  type: 'add'
  payload: Alert
}

interface RemoveAction {
  type: 'remove'
  payload: number
}

export const AlertStoreReducer: Reducer<AlertStoreState, AddAction | RemoveAction> = (state, action) => {
  switch (action.type) {
  case 'add':
    return {
      nextId: state.nextId + 1,
      alerts: [...state.alerts, {
        ...action.payload,
        id: state.nextId
      }]
    }
  case 'remove':
    return {
      nextId: state.nextId,
      alerts: state.alerts.filter(alert => alert.id !== action.payload)
    }
  }
}

export const AlertStoreContext = React.createContext<AlertStore>({
  state: {
    nextId: 0,
    alerts: []
  },
  add: (type: AlertType, content: string) => null,
  remove: (id: number) => null
})

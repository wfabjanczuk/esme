import React, { Reducer } from 'react'
import { AlertColor } from '@mui/material/Alert/Alert'

export interface FlashAlert {
  id: number
  type: AlertColor
  content: string
}

export interface AlertStore {
  state: AlertStoreState
  add: (type: AlertColor, content: string) => void
  remove: (id: number) => void
}

interface AlertStoreState {
  nextId: number
  alerts: FlashAlert[]
}

interface AddAction {
  type: 'add'
  payload: FlashAlert
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
  add: (type: AlertColor, content: string) => null,
  remove: (id: number) => null
})

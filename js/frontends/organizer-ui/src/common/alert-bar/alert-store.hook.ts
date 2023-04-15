import { useReducer } from 'react'
import { AlertStore, AlertStoreReducer } from './alert-store.context'
import { AlertColor } from '@mui/material/Alert/Alert'

export const useNewAlertStore = (): AlertStore => {
  const [state, dispatch] = useReducer(AlertStoreReducer, {
    nextId: 0,
    alerts: []
  })

  return {
    state,
    add: (type: AlertColor, content: string) => {
      dispatch({
        type: 'add',
        payload: {
          id: 0,
          type,
          content
        }
      })
    },
    remove: (id: number) => {
      dispatch({
        type: 'remove',
        payload: id
      })
    }
  }
}

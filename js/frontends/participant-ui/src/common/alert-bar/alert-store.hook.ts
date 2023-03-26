import { useReducer } from 'react'
import { AlertStore, AlertStoreReducer, AlertType } from './alert-store.context'

export const useNewAlertStore = (): AlertStore => {
  const [state, dispatch] = useReducer(AlertStoreReducer, {
    nextId: 0,
    alerts: []
  })

  return {
    state,
    add: (type: AlertType, content: string) => {
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

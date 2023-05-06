import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams'
import { Location, Message } from './messenger/structures'

dayjs.extend(utc)
const utcdayjs = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).utc()

export const parseDateTimeChatLabel = (value?: string): string =>
  utcdayjs(value).format('HH:mm, DD MMM YYYY')
export const parseDateTimeLabel = (value?: string): string =>
  utcdayjs(value).format('YYYY-MM-DD HH:mm')
export const parseDateTimeValue = (value?: string): string =>
  utcdayjs(value).format('YYYY-MM-DDTHH:mm')

export const parseDateTimeColumn = ({ value }: GridValueGetterParams<string>): string =>
  parseDateTimeLabel(value)

interface ErrorDataObject {
  message: string[] | string | undefined
}

export const parseErrorData = (errorData: ErrorDataObject | string | undefined): string[] => {
  if (errorData == null) {
    return []
  }

  if (typeof errorData === 'string') {
    return [errorData]
  }

  return parseErrorMessage(errorData.message)
}

export const parseErrorMessage = (message: string[] | string | undefined): string[] => {
  if (message === undefined) {
    return []
  }

  if (typeof message === 'string') {
    return [message]
  }

  return message
}

export const getLastLocationFromMessages = (messages: Message[]): Location | undefined => {
  const last = messages.length - 1
  for (let i = last; i >= 0; i--) {
    const msg = messages[i]
    if (msg.lat != null && msg.lng != null) {
      return {
        lat: msg.lat,
        lng: msg.lng
      }
    }
  }

  return undefined
}

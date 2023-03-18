import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams'

dayjs.extend(utc)
const utcdayjs = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).utc()

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

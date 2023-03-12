import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
const utcdayjs = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).utc()

export const parseDateTimeLabel = (value?: string): string =>
  utcdayjs(value).format('YYYY-MM-DD HH:mm')
export const parseDateTimeValue = (value?: string): string =>
  utcdayjs(value).format('YYYY-MM-DDTHH:mm')

export const parseErrorMessage = (message: string[] | string | undefined): string[] => {
  if (message === undefined) {
    return []
  }

  if (typeof message === 'string') {
    return [message]
  }

  return message
}

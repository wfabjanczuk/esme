export const parseErrorMessage = (message: string[] | string | undefined): string[] => {
  if (message === undefined) {
    return []
  }

  if (typeof message === 'string') {
    return [message]
  }

  return message
}

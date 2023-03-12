import { useState } from 'react'

interface ValuesHook<T extends string> {
  values: Record<T, string>
  newSetter: (key: T) => (value: string) => void
}

export const useValues = <T extends string>(initialValues: Record<T, string>): ValuesHook<T> => {
  const [values, setValues] = useState(initialValues)
  const newSetter = (key: T) => (value: string): void => setValues({
    ...values,
    [key]: value
  })

  return {
    values,
    newSetter
  }
}

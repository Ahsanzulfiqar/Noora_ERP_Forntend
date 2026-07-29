import { useEffect, useState } from 'react'

const STORAGE_KEY = 'noora.warehouse.selectedId'

const listeners = new Set()
let currentValue =
  typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) || '' : ''

const notify = () => {
  listeners.forEach((fn) => fn(currentValue))
}

export const useSelectedWarehouse = () => {
  const [value, setValue] = useState(currentValue)

  useEffect(() => {
    const listener = (v) => setValue(v)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const update = (v) => {
    const next = v || ''
    currentValue = next
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, next)
    }
    notify()
  }

  return [value, update]
}

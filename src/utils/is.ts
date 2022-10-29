import { AxiosError } from 'axios'

// eslint-disable-next-line
export function isAxiosError(e: any): e is AxiosError {
  if (e.isAxiosError) {
    return e
  }
  return e
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false
  return true
}

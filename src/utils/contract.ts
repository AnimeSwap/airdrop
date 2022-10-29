import { AptosResourceType } from '../types/aptos'

const EQUAL = 0
const LESS_THAN = 1
const GREATER_THAN = 2

function cmp(a: number, b: number) {
  if (a === b) {
    return EQUAL
  } else if (a < b) {
    return LESS_THAN
  } else {
    return GREATER_THAN
  }
}

// AnimeSwap define `<` :
// 1. length(CoinType1) < length(CoinType1)
// 2. length(CoinType1) == length(CoinType1) && String(CoinType1) < String(CoinType2)
function compare(symbolX: string, symbolY: string) {
  const iX = symbolX.length
  const iY = symbolY.length

  const lengthCmp = cmp(iX, iY)
  if (lengthCmp !== 0) return lengthCmp

  const minLength = Math.min(iX, iY)
  let index = 0
  while (index < minLength - 1) {
    const elemCmp = cmp(symbolX.charCodeAt(index), symbolY.charCodeAt(index))
    if (elemCmp !== 0) {
      return elemCmp
    }
    index++
  }

  return cmp(iX, iY)
}

export function isSortedSymbols(symbolX: string, symbolY: string) {
  return compare(symbolX, symbolY) === LESS_THAN
}

export function composeType(address: string, generics: AptosResourceType[]): AptosResourceType
export function composeType(
  address: string,
  struct: string,
  generics?: AptosResourceType[]
): AptosResourceType
export function composeType(
  address: string,
  module: string,
  struct: string,
  generics?: AptosResourceType[]
): AptosResourceType

export function composeType(address: string, ...args: unknown[]): AptosResourceType {
  const generics: string[] = Array.isArray(args[args.length - 1])
    ? (args.pop() as string[])
    : []
  const chains = [address, ...args].filter(Boolean)
  let result: string = chains.join('::')
  if (generics && generics.length) {
    result += `<${generics.join(',')}>`
  }
  return result
}

export function extractAddressFromType(type: string) {
  return type.split('::')[0]
}


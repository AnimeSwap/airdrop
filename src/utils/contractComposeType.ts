import { composeType } from './contract'

export function composeSwapEvent(swapScript: string, coin_x: string, coin_y: string) {
  return composeType(swapScript, 'Events', [coin_x, coin_y])
}

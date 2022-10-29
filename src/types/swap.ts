import Decimal from 'decimal.js'
import { AptosResourceType } from './aptos'

export type SwapPoolResource = {
  coin_x_reserve: {
    value: string
  }
  coin_y_reserve: {
    value: string
  }
  k_last: string
  last_block_timestamp: string
  last_price_x_cumulative: string
  last_price_y_cumulative: string
  lp_burn_cap: {
    dummy_field: boolean
  }
  lp_freeze_cap: {
    dummy_field: boolean
  }
  lp_mint_cap: {
    dummy_field: boolean
  }
}

export type CoinPair = {
  coinX: AptosResourceType
  coinY: AptosResourceType
}

export type MintBurnEvent = {
  amount_x: Decimal
  amount_y: Decimal
  liqudity: Decimal
}

export type EventParams = {
  coinPair: CoinPair
  fieldName: string | 'pair_created_event' | 'mint_event' | 'burn_event' | 'swap_event' | 'sync_event' | 'flash_swap_event'
  query?: {
    start?: bigint | number
    limit?: number
  }
}

export type EventMeta = {
  sender: AptosResourceType
  timestamp: number
}

export type LiquidityPoolResource = {
  coinX: AptosResourceType
  coinY: AptosResourceType
  coinXReserve: string
  coinYReserve: string
}

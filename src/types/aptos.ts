export type address = string
export type AptosResourceType = string

export type AptosResource<T = unknown> = {
  data: T
  type: string
}

export type AptosCoinInfoResource = {
  decimals: number
  name: string
  supply: {
    vec: [{
      aggregator: {
        vec: [{
          handle: address
          key: address
          limit: string
        }]
      }
      integer: {
        vec: [{
          limit: string
          value: string
        }]
      }
    }]
  }
  symbol: string
}

export type AptosCoinStoreResource = {
  coin: {
    value: string
  }
  deposit_events: {
    counter: string
    guid: {
      id: {
        addr: address
        creation_num: string
      }
    }
  }
  frozen: boolean
  withdraw_events: {
    counter: string
    guid: {
      id: {
        addr: address
        creation_num: string
      }
    }
  }
}

export type AptosTypeInfo = {
  account_address: AptosResourceType
  module_name: AptosResourceType
  struct_name: AptosResourceType
}

export type AptosLedgerInfo = {
  chain_id: number
  epoch: string
  ledger_version: string
  ledger_timestamp: string
  oldest_ledger_version: string
  block_height: string
  oldest_block_height: string
}

// BlockMetadataTransaction | StateCheckpointTransaction | UserTransaction
export type AptosTransaction = {
  version: string
  hash: string
  state_change_hash: string
  event_root_hash: string
  state_checkpoint_hash?: string
  gas_used: string
  success: boolean
  vm_status: string
  sender: string
  accumulator_root_hash: string
  timestamp: string
}

export type AptosEvent = {
  key: string
  version: string
  sequence_number: string
  type: string
  data: any
}

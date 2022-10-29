import Decimal from 'decimal.js'
import { NetworkType, SDK } from './sdk'
import { AptosEvent, AptosTransaction } from './types/aptos'
import { CoinPair, EventMeta, EventParams } from './types/swap'
import { composeSwapEvent } from './utils/contractComposeType'
import { d } from './utils/number'
import fs from 'fs'

const sdk = new SDK('https://aptos-mainnet.nodereal.io/v1/76329ac799a3432aaf9993833593b847', NetworkType.Mainnet)

const aptos2usd = 10  // 1 apt = 10x usd weight
const aptosCoin = '0x1::aptos_coin::AptosCoin'
const usdCoins = [
  '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
  '0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T',
  '0xc91d826e29a3183eb3b6f6aa3a722089fdffb8e9642b94c5fcd4c48d035c0080::coin::T',
  '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
  '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
  '0x1000000fa32d122c18a6a31c009ce5e71674f22d06a581bb0a15575e6addadcc::usda::USDA',
]

const startVersion = 0
const endVersion = 14400000 // 2022-10-27 06:02:10 GMT
const endTimestamp = 1666850530 // 2022-10-27 06:02:10 GMT
const address2TvlTimesTime: { [key: string]: Decimal } = {} // value(1apt) * time(seconds)
const sortedAddress: Array<{address: string, value: Decimal}> = []

// We encourage some pairs with BTC/ETH
const topPools = [
  // APT/tAPT
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin',
    factor: 1,
  },
  // APT/zUSDC
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    factor: 1,
  },
  // APT/whWBTC
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
    factor: 1.5,
  },
  // APT/zWETH
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
    factor: 1.5,
  },
  // APT/whWETH
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T',
    factor: 1.5,
  },
  // APT/whUSDC
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    factor: 1,
  },
  // APT/stAPT
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos',
    factor: 1,
  },
  // APT/zUSDT
  {
    coinX: '0x1::aptos_coin::AptosCoin',
    coinY: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    factor: 1,
  },
  // zUSDC/zUSDT
  {
    coinX: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    coinY: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    factor: 1,
  },
  // USDA/zUSDT
  {
    coinX: '0x1000000fa32d122c18a6a31c009ce5e71674f22d06a581bb0a15575e6addadcc::usda::USDA',
    coinY: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    factor: 1,
  },
]

// get events by coinPair and eventType
async function getEvents(params: EventParams): Promise<AptosEvent[]> {
  const { modules } = sdk.networkOptions
  const eventHandleStruct = composeSwapEvent(modules.Scripts, params.coinPair.coinX, params.coinPair.coinY)

  const events = await sdk.resources.getEventsByEventHandle(modules.ResourceAccountAddress, eventHandleStruct, params.fieldName, params.query)
  return events
}

// get tx by version
async function getTxByVersion(version: string): Promise<EventMeta> {
  const tx = await sdk.resources.fetchTransactionByVersion<AptosTransaction>(BigInt(version))
  return {
    sender: tx.sender,
    timestamp: Number(tx.timestamp.substring(0, tx.timestamp.length - 6)),
  }
}

// insert with order
function sortedInsert<T>(items: T[], add: T, comparator: (a: T, b: T) => number) {
  let index
  for (index = 0; index < items.length; index++) {
    const comp = comparator(items[index], add)
    if (comp >= 0) {
      break
    } else if (comp == -1) {
      continue
    }
  }
  items.splice(index, 0, add)
}

async function getCoinPairEvents(coinPair: CoinPair, mode: 'mint_event' | 'burn_event'): Promise<Array<AptosEvent>> {
  const batchSize = 100   // for rpc api, Max batch size is 100. More than 100 will take bug
  const allEvents: AptosEvent[] = []
  let eventParams: EventParams = {
      coinPair: coinPair,
      fieldName: mode,
      query: {
          limit: batchSize,
      },
  }
  let events = await getEvents(eventParams)
  allEvents.push(...events.filter(v => d(v.version).gt(d(startVersion)) && d(v.version).lt(d(endVersion)))) 
  while (events.length > 0
      && d(events[0].sequence_number).gt(0) 
      && d(events[0].version).gt(d(startVersion))) {
      console.log(`Counting ${mode} for ${coinPair.coinX}|${coinPair.coinY}, remains ${d(events[0].sequence_number)} events`)
      // the api is strange, cannot use reverse start, so we do it like this
      // you can only give the start sequence_number, so the next batch start should be `Max(events[0].sequence_number - batchSize, 0)`
      let start = BigInt(events[0].sequence_number) - BigInt(batchSize)
      const limit = start > BigInt(0) ? batchSize : batchSize + Number((start - BigInt(0)))
      start = start > BigInt(0) ? start : BigInt(0)
      eventParams = {
          coinPair: coinPair,
          fieldName: mode,
          query: {
              start: start,
              limit: limit,
          },
      }
      events = await getEvents(eventParams)
      allEvents.push(...events.filter(v => d(v.version).gt(d(startVersion)) && d(v.version).lt(d(endVersion))))
  }
  console.log(`event length: ${allEvents.length}`)
  return allEvents
}

function updateTVL(address: string, priceTimesAmount: Decimal, timestamp: number, mode: 'plus' | 'minus') {
  if (!address2TvlTimesTime[address]) {
    address2TvlTimesTime[address] = d(0)
  }
  const timePeriod = endTimestamp - timestamp
  address2TvlTimesTime[address] = address2TvlTimesTime[address][mode](d(timePeriod).mul(priceTimesAmount))
}

async function mintBurnEvent(coinX: string, coinY: string, mode: 'mint' | 'burn', factor: number) {
  const networkBatch = 50
  console.log(`${mode}_event processing...`)
  const events = await getCoinPairEvents({
    coinX: coinX,
    coinY: coinY,
  }, `${mode}_event`)
  const plusMinus = mode == 'mint' ? 'plus' : 'minus'
  while (true) {
    const partEvents = events.splice(0, networkBatch)
    if (partEvents.length === 0) break
    console.log(`Processing ${mode}_event for ${coinX}|${coinY}, remains ${events.length} events`)
    await Promise.all(partEvents.map(async (event) =>{
      const eventMeta = await getTxByVersion(event.version)
      const sender = eventMeta.sender
      const timestamp = eventMeta.timestamp
      const amountX = event.data.amount_x
      const amountY = event.data.amount_y
      if (coinX == aptosCoin) {
        updateTVL(sender, d(amountX).div(1e8).mul(2).mul(factor), timestamp, plusMinus)
      } else if (usdCoins.includes(coinX)) {
        updateTVL(sender, d(amountX).div(1e6).div(aptos2usd).mul(2).mul(factor), timestamp, plusMinus)
      } else if (usdCoins.includes(coinY)) {
        updateTVL(sender, d(amountY).div(1e6).div(aptos2usd).mul(2).mul(factor), timestamp, plusMinus)
      } else {
        throw(`Cannot decide coin type: ${coinX}, ${coinY}`)
      }
    }))
  }
}

async function calculateTVL(coinX: string, coinY: string, factor: number) {
  await mintBurnEvent(coinX, coinY, 'mint', factor)
  await mintBurnEvent(coinX, coinY, 'burn', factor)
}

async function main() {
  for (const pool of topPools) {
    await calculateTVL(pool.coinX, pool.coinY, pool.factor)
  }
  for (const key of Object.keys(address2TvlTimesTime)) {
    if (address2TvlTimesTime[key].lte(0)) continue
    sortedInsert(
      sortedAddress,
      {
        address: key,
        value: address2TvlTimesTime[key],
      },
      (a, b) => a.value.lt(b.value) ? 1 : -1
    )
  }
  const data = JSON.stringify(sortedAddress)
  fs.writeFileSync('result.json', data)
}

main()

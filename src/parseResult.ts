import Decimal from 'decimal.js'
import { d } from './utils/number'
import fs from 'fs'

type Element = { 
  address: string
  value: Decimal | string
}

let totalValue = d(0)
let totalTvlTimesTime = d(0)
const addressList: Array<string> = []
const addressPercent: Array<{address: string, value: Decimal}> = []
let output = 'address,percent\n'

function main() {
  let sortedAddressArray: Array<Element> = []
  try {
    const rawData = fs.readFileSync('result.json')
    sortedAddressArray = JSON.parse(rawData.toString())
  } catch (e) {
    throw(e)
  }
  // only consider add lp great than `0.5 apt * 7days`
  sortedAddressArray = sortedAddressArray.filter(element => {
    // 0.5 apt * 7days
    return d(element.value).gt(d(7 * 86400 * 0.5))
  })
  // thanks for large liquidity provider, give them bonus
  sortedAddressArray[0].value = d(sortedAddressArray[0].value).mul(1.75)
  sortedAddressArray[1].value = d(sortedAddressArray[1].value).mul(1.5)
  sortedAddressArray[2].value = d(sortedAddressArray[2].value).mul(1.25)
  sortedAddressArray.forEach(element => {
    totalValue = totalValue.add(d(element.value))
    totalTvlTimesTime = totalTvlTimesTime.add(d(element.value).div(7 * 86400 * 1))
    sortedInsert(addressList, element.address, (a, b) => a > b ? 1 : -1)
  })
  for (const element of sortedAddressArray) {
    const currentAddr = {
      address: element.address,
      value: d(element.value).div(totalValue),
    }
    addressPercent.push(currentAddr)
    output += `${currentAddr.address},${currentAddr.value.mul(100).toFixed(5)}\n`
  }
  console.log(`airdrop address length: ${addressPercent.length}`)
  console.log(`total apt * 7 days: ${totalTvlTimesTime}`)
  fs.writeFileSync('result_percent.csv', output)
  fs.writeFileSync('result_address.txt', addressList.toString())
}

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

main()

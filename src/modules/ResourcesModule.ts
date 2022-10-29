import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'
import { AptosEvent, AptosResource, AptosResourceType } from '../types/aptos'
import { isAxiosError } from '../utils/is'

export class ResourcesModule implements IModule {
  protected _sdk: SDK

  get sdk() {
    return this._sdk
  }

  constructor(sdk: SDK) {
    this._sdk = sdk
  }

  async fetchAccountResource<T = unknown>(accountAddress: string, resourceType: AptosResourceType, ledgerVersion?: bigint | number): Promise<AptosResource<T> | undefined> {
    try {
      const response = await this._sdk.client.getAccountResource(accountAddress, resourceType, {ledgerVersion: ledgerVersion})
      return response as unknown as AptosResource<T>
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (e.response?.status === 404) {
          return undefined
        }
      }
      console.log(e)
      throw e
    }
  }

  async fetchAccountResources<T = unknown>(accountAddress: string, ledgerVersion?: bigint | number): Promise<AptosResource<T>[] | undefined> {
    try {
      const response = await this._sdk.client.getAccountResources(accountAddress, {ledgerVersion: ledgerVersion})
      return response as unknown as AptosResource<T>[]
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (e.response?.status === 404) {
          return undefined
        }
      }
      throw e
    }
  }

  async fetchLedgerInfo<T = unknown>(): Promise<T> {
    try {
      const response = await this._sdk.client.getLedgerInfo()
      return response as unknown as T
    } catch (e: unknown) {
      console.log(e)
      throw e
    }
  }

  async fetchTransactionByVersion<T = unknown>(txnVersion: bigint | number): Promise<T> {
    try {
      const response = await this._sdk.client.getTransactionByVersion(txnVersion)
      return response as unknown as T
    } catch (e: unknown) {
      console.log(e)
      throw e
    }
  }

  async getEventsByEventHandle(
    address: string,
    eventHandleStruct: string,
    fieldName: string,
    query?: { start?: bigint | number, limit?: number },
  ): Promise<AptosEvent[]> {
    try {
      const response = await this._sdk.client.getEventsByEventHandle(address, eventHandleStruct, fieldName, query)
      return response as unknown as AptosEvent[]
    } catch (e: unknown) {
      console.log(e)
      throw e
    }
  }
}

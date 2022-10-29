import { AptosClient } from 'aptos'
import { ResourcesModule } from './modules/ResourcesModule'
import { AptosResourceType } from './types/aptos'

export type SdkOptions = {
  nodeUrl: string
  networkOptions: {
    modules: {
      Scripts: AptosResourceType
      ResourceAccountAddress: AptosResourceType
      DeployerAddress: AptosResourceType
    } & Record<string, AptosResourceType>
  }
}

export enum NetworkType {
  Mainnet,
  Devnet,
  Testnet,
}


export class SDK {
  protected _client: AptosClient
  protected _resources: ResourcesModule
  protected _networkOptions: SdkOptions['networkOptions']

  get client() {
    return this._client
  }

  get networkOptions() {
    return this._networkOptions
  }

  get resources() {
    return this._resources
  }

  /**
   * SDK constructor
   * @param nodeUrl string
   * @param networkType? NetworkType
   */
   constructor(nodeUrl: string, networkType?: NetworkType) {
    const devnetOptions = {
      modules: {
        Scripts: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1',
        DeployerAddress: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c',
        ResourceAccountAddress: '0xe73ee18380b91e37906a728540d2c8ac7848231a26b99ee5631351b3543d7cf2',
      },
    }
    const testnetOptions = {
      modules: {
        Scripts: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1f1',
        DeployerAddress: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c',
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
      },
    }
    const mainnetOptions = {
      modules: {
        Scripts: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c::AnimeSwapPoolV1',
        DeployerAddress: '0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c',
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
      },
    }
    let networkOptions = mainnetOptions  // default network
    if (networkType == NetworkType.Devnet) networkOptions = devnetOptions
    if (networkType == NetworkType.Testnet) networkOptions = testnetOptions
    if (networkType == NetworkType.Mainnet) networkOptions = mainnetOptions
    const options = {
      nodeUrl,
      networkOptions: networkOptions,
    }
    this._networkOptions = options.networkOptions
    this._client = new AptosClient(options.nodeUrl)
    this._resources = new ResourcesModule(this)
  }
}
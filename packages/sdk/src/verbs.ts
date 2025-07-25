import { unichain } from 'viem/chains'

import { ChainManager } from './services/chainManager.js'
import type { VerbsConfig, VerbsInterface } from './types/verbs.js'
import type {
  GetAllWalletsOptions,
  Wallet,
  WalletProvider,
} from './types/wallet.js'
import { PrivyWalletProvider } from './wallet/providers/privy.js'

/**
 * Main Verbs SDK class
 * @description Core implementation of the Verbs SDK
 */
export class Verbs implements VerbsInterface {
  createWallet!: (userId: string) => Promise<Wallet>
  getWallet!: (userId: string) => Promise<Wallet | null>
  getAllWallets!: (options?: GetAllWalletsOptions) => Promise<Wallet[]>

  private walletProvider: WalletProvider
  private chainManager: ChainManager

  constructor(config: VerbsConfig) {
    this.chainManager = new ChainManager([
      {
        chainId: unichain.id,
        rpcUrl: unichain.rpcUrls.default.http[0],
        name: unichain.name,
      },
    ])
    this.walletProvider = this.createWalletProvider(config)

    // Delegate wallet methods to wallet provider
    this.createWallet = this.walletProvider.createWallet.bind(
      this.walletProvider,
    )
    this.getWallet = this.walletProvider.getWallet.bind(this.walletProvider)
    this.getAllWallets = this.walletProvider.getAllWallets.bind(
      this.walletProvider,
    )
  }

  private createWalletProvider(config: VerbsConfig): WalletProvider {
    const { wallet } = config

    switch (wallet.type) {
      case 'privy':
        return new PrivyWalletProvider(
          wallet.appId,
          wallet.appSecret,
          this.chainManager, // Pass the ChainManager instead of entire Verbs instance
        )
      default:
        throw new Error(`Unsupported wallet provider type: ${wallet.type}`)
    }
  }
}

/**
 * Initialize Verbs SDK
 * @description Factory function to create a new Verbs SDK instance
 * @param config - SDK configuration
 * @returns Initialized Verbs SDK instance
 */
export function initVerbs(config: VerbsConfig): VerbsInterface {
  return new Verbs(config)
}

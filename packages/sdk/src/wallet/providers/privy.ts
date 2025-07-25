import { PrivyClient } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type {
  GetAllWalletsOptions,
  WalletProvider,
} from '../../types/wallet.js'
import { Wallet } from '../index.js'

/**
 * Privy wallet provider implementation
 * @description Wallet provider implementation using Privy service
 */
export class PrivyWalletProvider implements WalletProvider {
  private privy: PrivyClient

  /**
   * Create a new Privy wallet provider
   * @param appId - Privy application ID
   * @param appSecret - Privy application secret
   */
  constructor(appId: string, appSecret: string) {
    this.privy = new PrivyClient(appId, appSecret)
  }

  /**
   * Create new wallet via Privy
   * @description Creates a new wallet using Privy's wallet API
   * @param userId - User identifier for the wallet
   * @returns Promise resolving to new wallet instance
   * @throws Error if wallet creation fails
   */
  async createWallet(userId: string): Promise<Wallet> {
    try {
      const wallet = await this.privy.walletApi.createWallet({
        chainType: 'ethereum',
      })

      const walletInstance = new Wallet(wallet.id)
      walletInstance.address = wallet.address as Address
      return walletInstance
    } catch {
      throw new Error(`Failed to create wallet for user ${userId}`)
    }
  }

  /**
   * Get wallet by user ID via Privy
   * @description Retrieves wallet information from Privy service
   * @param userId - User identifier
   * @returns Promise resolving to wallet or null if not found
   */
  async getWallet(userId: string): Promise<Wallet | null> {
    try {
      // TODO: Implement proper user-to-wallet lookup
      const wallet = await this.privy.walletApi.getWallet({ id: userId })

      const walletInstance = new Wallet(wallet.id)
      walletInstance.address = wallet.address as Address
      return walletInstance
    } catch {
      return null
    }
  }

  /**
   * Get all wallets via Privy
   * @description Retrieves all wallets from Privy service with optional filtering
   * @param options - Optional parameters for filtering and pagination
   * @returns Promise resolving to array of wallets
   */
  async getAllWallets(options?: GetAllWalletsOptions): Promise<Wallet[]> {
    try {
      const response = await this.privy.walletApi.getWallets({
        limit: options?.limit,
        cursor: options?.cursor,
      })

      return response.data.map((wallet) => {
        const walletInstance = new Wallet(wallet.id)
        walletInstance.address = wallet.address as Address
        return walletInstance
      })
    } catch {
      throw new Error('Failed to retrieve wallets')
    }
  }
}

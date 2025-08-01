import type { ChainConfig } from '@/types/chain.js'

import type { LendConfig, LendProvider } from './lend.js'
import type { GetAllWalletsOptions, Wallet } from './wallet.js'

/**
 * Core Verbs SDK interface
 * @description Main interface for interacting with the Verbs SDK
 */
export interface VerbsInterface {
  /**
   * Get the lend provider instance
   * @returns LendProvider instance if configured
   */
  readonly lend: LendProvider
  /**
   * Create a new wallet
   * @param userId - User identifier for the wallet
   * @returns Promise resolving to new wallet instance
   */
  createWallet(userId: string): Promise<Wallet>
  /**
   * Get wallet by user ID
   * @param userId - User identifier
   * @returns Promise resolving to wallet or null if not found
   */
  getWallet(userId: string): Promise<Wallet | null>
  /**
   * Get all wallets
   * @param options - Optional parameters for filtering and pagination
   * @returns Promise resolving to array of wallets
   */
  getAllWallets(options?: GetAllWalletsOptions): Promise<Wallet[]>
}

/**
 * Verbs SDK configuration
 * @description Configuration object for initializing the Verbs SDK
 */
export interface VerbsConfig {
  /** Wallet provider configuration */
  wallet: WalletConfig
  /** Lending provider configuration (optional) */
  lend?: LendConfig
  /** Chains to use for the SDK */
  chains?: ChainConfig[]
}

/**
 * Wallet provider configuration
 * @description Configuration for wallet providers
 */
export type WalletConfig = PrivyWalletConfig

/**
 * Privy wallet provider configuration
 * @description Configuration specific to Privy wallet provider
 */
export interface PrivyWalletConfig {
  /** Wallet provider type */
  type: 'privy'
  /** Privy app ID */
  appId: string
  /** Privy app secret */
  appSecret: string
}

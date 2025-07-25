import { type Address, erc20Abi, formatUnits } from 'viem'

import { USDC_TOKEN_ADDRESSES } from '@/constants/tokenAddresses.js'
import type { ChainManager } from '@/services/chainManager.js'

import type {
  ChainBalance,
  Wallet as WalletInterface,
} from '@/types/wallet.js'

/**
 * Wallet implementation
 * @description Concrete implementation of the Wallet interface
 */
export class Wallet implements WalletInterface {
  id: string
  address: Address
  private chainManager: ChainManager

  /**
   * Create a new wallet instance
   * @param id - Unique wallet identifier
   * @param address - Wallet address
   * @param chainManager
   */
  constructor(id: string, address: Address, chainManager: ChainManager) {
    this.id = id
    this.address = address
    this.chainManager = chainManager
  }

  /**
   * Get USDC balance across all supported chains
   * @returns Promise resolving to array of chain balances
   */
  async getBalance(): Promise<ChainBalance[]> {
    const chainIds = this.chainManager.getSupportedChains()
    const balancePromises = chainIds.map(async (chainId) => {
      try {
        const balance = await this.getBalanceForChain(chainId)

        return {
          chainId,
          balance,
        }
      } catch (error) {
        // Return zero balance if there's an error fetching from this chain
        console.warn(`Failed to fetch balance for chain ${chainId}:`, error)
        return {
          chainId,
          balance: 0n,
        }
      }
    })

    return Promise.all(balancePromises)
  }

  /**
   * Get total USDC balance across all chains
   * @returns Promise resolving to total balance in wei
   */
  async getTotalBalance(): Promise<bigint> {
    const balances = await this.getBalance()
    return balances.reduce((total, { balance }) => total + balance, 0n)
  }

  /**
   * Get USDC balance for a specific chain
   * @param chainId - Target chain ID
   * @returns Promise resolving to balance in wei
   */
  async getBalanceForChain(chainId: number): Promise<bigint> {
    const publicClient = this.chainManager.getPublicClient(chainId)
    const tokenAddress = USDC_TOKEN_ADDRESSES[chainId]

    if (!tokenAddress) {
      throw new Error(`USDC token not supported on chain ${chainId}`)
    }

    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [this.address],
    })

    return balance
  }
}

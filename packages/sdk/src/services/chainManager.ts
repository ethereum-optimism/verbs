import { createPublicClient, extractChain, http, type PublicClient } from 'viem'

import { SUPPORTED_CHAINS } from '../constants/supportedChains.js'
import type { ChainConfig } from '../types/verbs.js'

/**
 * Chain Manager Service
 * @description Manages public clients and chain infrastructure for the Verbs SDK
 */
export class ChainManager {
  private publicClients: Map<number, PublicClient>
  private chainConfigs: ChainConfig[]

  constructor(chains: ChainConfig[]) {
    this.chainConfigs = chains
    this.publicClients = this.createPublicClients(chains)
  }

  /**
   * Create public clients for all configured chains
   */
  private createPublicClients(
    chains: ChainConfig[],
  ): Map<number, PublicClient> {
    const clients = new Map<number, PublicClient>()

    for (const chainConfig of chains) {
      const client = createPublicClient({
        chain: SUPPORTED_CHAINS.find(chain => chain.id === chainConfig.chainId),
        transport: http(chainConfig.rpcUrl),
      })

      clients.set(chainConfig.chainId, client)
    }

    return clients
  }

  /**
   * Get public client for a specific chain
   */
  getPublicClient(chainId: number): PublicClient {
    const client = this.publicClients.get(chainId)
    if (!client) {
      throw new Error(`No public client configured for chain ID: ${chainId}`)
    }
    return client
  }

  /**
   * Get all configured public clients
   */
  getAllPublicClients(): Map<number, PublicClient> {
    return this.publicClients
  }

  /**
   * Get supported chain IDs
   */
  getSupportedChains(): number[] {
    return this.chainConfigs.map((c) => c.chainId)
  }

  /**
   * Check if a chain is supported
   */
  isChainSupported(chainId: number): boolean {
    return this.publicClients.has(chainId)
  }

  /**
   * Get chain configuration
   */
  getChainConfig(chainId: number): ChainConfig | undefined {
    return this.chainConfigs.find((config) => config.chainId === chainId)
  }
}

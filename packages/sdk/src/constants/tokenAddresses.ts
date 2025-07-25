import type { Address, Chain } from 'viem'
import { unichain } from 'viem/chains'

/**
 * USDC token addresses by chain ID
 */
export const USDC_TOKEN_ADDRESSES: Record<number, Address> = {
  [unichain.id]: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
}

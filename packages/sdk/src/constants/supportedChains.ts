import type { Chain } from 'viem'
import { unichain } from 'viem/chains'

export const SUPPORTED_CHAINS: Chain[] = [unichain] as const
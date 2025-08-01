import {
  initVerbs,
  type VerbsConfig,
  type VerbsInterface,
} from '@eth-optimism/verbs-sdk'
import { unichain } from 'viem/chains'

import { env } from './env.js'

let verbsInstance: VerbsInterface

export function createVerbsConfig(): VerbsConfig {
  return {
    wallet: {
      type: 'privy',
      appId: env.PRIVY_APP_ID,
      appSecret: env.PRIVY_APP_SECRET,
    },
    lend: {
      type: 'morpho',
    },
    chains: [
      {
        chainId: unichain.id,
        rpcUrl: env.RPC_URL,
      },
    ],
  }
}

export function initializeVerbs(config?: VerbsConfig): void {
  const verbsConfig = config || createVerbsConfig()
  verbsInstance = initVerbs(verbsConfig)
}

export function getVerbs(): VerbsInterface {
  if (!verbsInstance) {
    throw new Error('Verbs SDK not initialized. Call initializeVerbs() first.')
  }
  return verbsInstance
}

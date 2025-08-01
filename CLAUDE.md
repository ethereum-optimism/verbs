# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a pnpm workspace monorepo. Use pnpm for all package management.

### Setup
```bash
pnpm install
```

### Build
```bash
# Build all packages
pnpm build

# Build specific package
cd packages/sdk && pnpm build
cd packages/demo/backend && pnpm build
cd packages/demo/frontend && pnpm build
```

### Development
```bash
# Run backend service in development mode
cd packages/demo/backend && pnpm dev

# Run frontend development server
cd packages/demo/frontend && pnpm dev
```

### Linting and Type Checking
```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check all packages
pnpm typecheck
```

### Package-specific commands
- SDK: `pnpm docs` (TypeDoc generation), `pnpm test` (placeholder)
- Frontend: `pnpm preview` (preview production build)
- Backend: `pnpm start` (production mode)

## Architecture

### Monorepo Structure
- `packages/sdk/` - Core Verbs TypeScript SDK
- `packages/demo/backend/` - Hono-based backend service demonstrating SDK usage
- `packages/demo/frontend/` - React + Vite frontend application

### SDK Architecture (`packages/sdk/`)
The SDK follows a provider pattern for wallet integration:

- **Core Classes**:
  - `Verbs` - Main SDK class implementing `VerbsInterface`
  - `Wallet` - Wallet implementation with balance and transaction methods
  - `WalletProviderPrivy` - Privy integration adapter

- **Configuration**: Uses `VerbsConfig` with wallet provider settings (currently supports Privy)
- **Dependencies**: Built on viem for Ethereum interaction, Privy for wallet management
- **Exports**: All public API exports through `src/index.ts`

### Backend Service (`packages/demo/backend/`)
- **Framework**: Hono web framework with Node.js server
- **Architecture**: MVC pattern with controllers, services, middleware
- **Configuration**: Environment-based config with validation (envalid)
- **CORS**: Configured for localhost frontend development
- **Entry**: Uses commander.js for CLI and @eth-optimism/utils-app base class

### Frontend Application (`packages/demo/frontend/`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: Terminal-based UI theme
- **Dependencies**: Consumes SDK as workspace dependency

## Key Patterns

### Workspace Dependencies
- All demo apps reference SDK via `"@eth-optimism/verbs-sdk": "workspace:*"`
- Backend and frontend are separate packages under `packages/demo/`

### TypeScript Configuration
- Shared base config in `tsconfig.base.json`
- Package-specific tsconfig files extend the base
- Uses `resolve-tspaths` for path resolution in builds

### Provider Pattern
The SDK uses a provider pattern for wallet integrations. New wallet providers implement the `WalletProvider` interface and are registered in the `createWalletProvider` factory method in `verbs.ts:30-39`.

## CI/CD Configuration

### CircleCI
This repository uses CircleCI for continuous integration, mirroring the ecosystem repo setup:

- **Configuration**: `.circleci/config.yml`
- **Jobs**: 
  - `check` - Runs build, typecheck, and lint on all pushes
  - `docker-build` & `docker-publish` - Builds and publishes Docker images for backend/frontend on main branch
- **Docker Images**: 
  - Backend: `packages/demo/backend/Dockerfile`
  - Frontend: `packages/demo/frontend/Dockerfile` (nginx-based for static assets)

### Docker Build Process
- Uses multi-stage builds with pnpm workspace support
- SDK is built first as dependency for demo applications
- Production images are optimized for deployment

## Important Notes

- Node.js >=18 required (specified in root package.json engines)
- Backend uses @eth-optimism/utils-app for application framework
- Frontend Terminal component provides the main UI interaction
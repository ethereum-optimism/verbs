import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Terminal from './Terminal'

// Mock the verbsApi
vi.mock('../api/verbsApi', () => ({
  verbsApi: {
    createWallet: vi.fn(() =>
      Promise.resolve({
        address: '0x1234567890123456789012345678901234567890',
        userId: 'test-user',
      })
    ),
    getAllWallets: vi.fn(() =>
      Promise.resolve({
        wallets: [
          { address: '0x1234567890123456789012345678901234567890' },
          { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
        ],
        count: 2,
      })
    ),
  },
}))

describe('Terminal', () => {
  it('renders terminal with welcome message', async () => {
    render(<Terminal />)

    // Check for terminal header
    expect(screen.getByText('verbs-terminal')).toBeInTheDocument()

    // Check for ASCII art
    expect(screen.getByText(/██╗.*██╗.*███████╗/)).toBeInTheDocument()

    // Check for subtitle
    expect(screen.getByText('Verbs library for the OP Stack')).toBeInTheDocument()

    // Check for help content
    expect(screen.getByText(/Available commands:/)).toBeInTheDocument()
  })

  it('displays current time in header', () => {
    render(<Terminal />)

    // Check that there's a time display (will match format like "10:30:45 AM")
    const timeElement = screen.getByText(/\d{1,2}:\d{2}:\d{2}/)
    expect(timeElement).toBeInTheDocument()
  })

  it('handles help command', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    await user.type(input, 'help')
    await user.keyboard('{Enter}')

    // Check that help command was executed (should appear twice - once from initial load, once from command)
    const helpCommands = screen.getAllByText('verbs: $ help')
    expect(helpCommands).toHaveLength(2)
    
    // Check that help content is displayed (should appear twice - once from initial load, once from command)
    const helpTexts = screen.getAllByText(/Available commands:/)
    expect(helpTexts).toHaveLength(2)
  })

  it('handles clear command', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    // First verify welcome content is there
    expect(screen.getByText('Verbs library for the OP Stack')).toBeInTheDocument()
    
    await user.type(input, 'clear')
    await user.keyboard('{Enter}')

    // After clear, welcome content should be gone
    expect(screen.queryByText('Verbs library for the OP Stack')).not.toBeInTheDocument()
  })

  it('handles status command', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    await user.type(input, 'status')
    await user.keyboard('{Enter}')

    // Check that status command was executed
    expect(screen.getByText('verbs: $ status')).toBeInTheDocument()
    
    // Check for status information
    expect(screen.getByText(/System Status: ONLINE/)).toBeInTheDocument()
    expect(screen.getByText(/SDK Version: v0.0.2/)).toBeInTheDocument()
  })

  it('handles unknown command', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    await user.type(input, 'unknown-command')
    await user.keyboard('{Enter}')

    // Check that command was executed
    expect(screen.getByText('verbs: $ unknown-command')).toBeInTheDocument()
    
    // Check for error message
    expect(
      screen.getByText(/Command not found: unknown-command/)
    ).toBeInTheDocument()
  })

  it('handles wallet list command', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    await user.type(input, 'wallet list')
    await user.keyboard('{Enter}')

    // Check that command was executed
    expect(screen.getByText('verbs: $ wallet list')).toBeInTheDocument()
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.getByText(/Found 2 wallet/)).toBeInTheDocument()
    })

    // Check that wallet addresses are displayed
    expect(
      screen.getByText(/0x1234567890123456789012345678901234567890/)
    ).toBeInTheDocument()
  })

  it('handles wallet create command flow', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    // Start wallet creation
    await user.type(input, 'wallet create')
    await user.keyboard('{Enter}')

    // Check that command was executed and prompt appeared
    expect(screen.getByText('verbs: $ wallet create')).toBeInTheDocument()
    expect(screen.getByText('Enter unique userId:')).toBeInTheDocument()

    // Enter user ID
    await user.type(input, 'test-user-123')
    await user.keyboard('{Enter}')

    // Wait for wallet creation to complete
    await waitFor(() => {
      expect(screen.getByText(/Wallet created successfully!/)).toBeInTheDocument()
    })

    // Check that wallet details are displayed
    expect(
      screen.getByText(/Address: 0x1234567890123456789012345678901234567890/)
    ).toBeInTheDocument()
    expect(screen.getByText(/User ID: test-user/)).toBeInTheDocument()
  })

  it('handles command history with arrow keys', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    
    // Execute a few commands
    await user.type(input, 'help')
    await user.keyboard('{Enter}')
    
    await user.type(input, 'status')
    await user.keyboard('{Enter}')

    // Use arrow up to navigate history
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveValue('status')
    
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveValue('help')
    
    // Use arrow down to navigate forward
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveValue('status')
  })

  it('handles coming soon commands', async () => {
    const user = userEvent.setup()
    render(<Terminal />)

    const input = screen.getByRole('textbox')
    const comingSoonCommands = ['fund', 'lend', 'borrow', 'repay', 'swap', 'earn']
    
    for (const command of comingSoonCommands) {
      await user.clear(input)
      await user.type(input, command)
      await user.keyboard('{Enter}')

      // Check that command was executed
      expect(screen.getByText(`verbs: $ ${command}`)).toBeInTheDocument()
      
      // Check for "Soon.™" message (there will be multiple instances)
      expect(screen.getAllByText('Soon.™').length).toBeGreaterThan(0)
    }
  })
})
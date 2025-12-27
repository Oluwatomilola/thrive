# Stacks Staking dApp with WalletConnect Integration

A real-time, event-driven Stacks staking application built with WalletConnect, Hiro Chainhooks, and modern React.

## Features

- **WalletConnect Integration**: Connect your Stacks wallet securely
- **Staking**: Stake STX and earn 10% rewards
- **Unstaking**: Withdraw your stake plus rewards
- **Real-time Updates**: Live activity feed powered by Hiro Chainhooks
- **Transaction Monitoring**: Track pending, confirmed, and failed transactions
- **Responsive Design**: Works on desktop and mobile

## Project Structure

```
src/
├── components/
│   ├── ConnectWalletButton.tsx      # Wallet connection UI
│   ├── StakingForm.tsx              # Staking transaction form
│   ├── UnstakingComponent.tsx       # Unstaking transaction component
│   └── ActivityFeed.tsx             # Real-time activity display
├── hooks/
│   └── useWalletConnect.ts          # Wallet connection hook
├── lib/
│   ├── config.ts                    # Configuration and constants
│   ├── account.ts                   # Account balance and stake queries
│   ├── stacks-tx.ts                 # Transaction builders
│   └── transaction-status.ts        # Transaction status polling
├── store/
│   └── wallet-store.ts              # Zustand wallet state management
├── pages/
│   └── StakingDApp.tsx              # Main application page
├── styles/
│   └── app.css                      # Global styles
└── .env.example                     # Environment variables template
```

## Smart Contract

Located in `contracts/message-board.clar`:

- **stake(amount)**: Stake STX amount
- **unstake()**: Withdraw stake + 10% rewards
- **get-stake(user)**: Query user's current stake

Events emitted:

- `stake`: Triggered on successful stake
- `unstake`: Triggered on successful unstake (subscribed by Chainhooks)

## Setup

### Prerequisites

- Node.js 16+ and npm
- Stacks wallet (Hiro Wallet or similar)
- WalletConnect Project ID (get one at https://walletconnect.com)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp src/.env.example .env
   ```

   Update `.env` with your values:

   ```env
   VITE_CONTRACT_ADDRESS=SP3FBR6Z532SXEMHD5P4JQ76FCBCSQD84SPJWM6H1
   VITE_NETWORK=testnet
   VITE_STACKS_API=https://api.testnet.hiro.so
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Smart Contract Deployment

1. **Compile the contract**

   ```bash
   npm run contract:build
   ```

2. **Run tests**

   ```bash
   npm run test
   ```

3. **Deploy to testnet**
   ```bash
   npm run contract:deploy
   ```

## Usage

### Connecting Wallet

1. Click "Connect Wallet" button
2. Select your wallet (Hiro, Leather, etc.)
3. Approve the connection
4. Your balance and current stake will be displayed

### Staking STX

1. Enter the amount to stake (in STX)
2. Click "Stake STX"
3. Approve the transaction in your wallet
4. Transaction will appear in the activity feed
5. Status updates as the transaction confirms on-chain

### Unstaking

1. Click "Unstake All"
2. Confirm the transaction
3. You'll receive your original stake + 10% reward
4. Activity will be recorded and displayed

## Real-Time Updates with Hiro Chainhooks

The app integrates with Hiro Chainhooks for real-time event notifications:

1. **Backend Webhook**: Receives on-chain events
2. **WebSocket Broadcasting**: Pushes updates to connected clients
3. **Activity Feed**: Updates automatically when events are confirmed

### Setting Up Chainhooks

1. Create a Hiro Chainhooks account
2. Register your webhook URL
3. Subscribe to contract events:
   - `message-board::stake`
   - `message-board::unstake`

Example webhook payload:

```json
{
  "event": "stake",
  "user": "SP...",
  "amount": 1000000,
  "block": 12345,
  "txId": "0x..."
}
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

### Run tests in watch mode

```bash
npm run test:watch
```

## API Endpoints (if backend is running)

- `GET /health`: Health check
- `POST /webhook/chainhook`: Receive on-chain events
- `WS /events`: WebSocket connection for real-time updates

## Architecture

### Frontend

- **React**: UI framework
- **TypeScript**: Type safety
- **Zustand**: State management
- **@stacks/auth**: Wallet authentication
- **@stacks/transactions**: Transaction building
- **@stacks/blockchain-api-client**: On-chain queries

### Smart Contract

- **Clarity**: Smart contract language
- **Maps**: Store user stakes
- **Print Events**: Emit events for Chainhooks

### Backend (Optional)

- **Node.js + Express**: API server
- **Chainhooks**: Event subscriptions
- **WebSocket**: Real-time push
- **PostgreSQL/SQLite**: Event persistence

## Environment Variables

| Variable                        | Description                 | Example                       |
| ------------------------------- | --------------------------- | ----------------------------- |
| `VITE_CONTRACT_ADDRESS`         | Contract deployment address | `SP...`                       |
| `VITE_NETWORK`                  | Network (testnet/mainnet)   | `testnet`                     |
| `VITE_STACKS_API`               | Stacks API endpoint         | `https://api.testnet.hiro.so` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID    | `abc123...`                   |

## Troubleshooting

### Wallet Connection Issues

- Ensure your wallet is installed and unlocked
- Clear browser storage: `localStorage.clear()`
- Try a different wallet provider

### Transaction Failures

- Check your STX balance
- Verify contract address matches your network
- Check fee estimation with higher gas

### Activity Feed Not Updating

- Confirm Chainhooks backend is running
- Check webhook URL accessibility
- Verify webhook secret is configured

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature/your-feature`
5. Submit pull request

## License

MIT

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Hiro Chainhooks](https://docs.hiro.so/chainhooks)
- [WalletConnect](https://walletconnect.com)
- [Clarity Language](https://clarity-lang.org)
- [Stacks Explorer](https://explorer.hiro.so)

## Support

For issues and questions:

1. Check existing GitHub issues
2. Create a new issue with details
3. Join the Stacks community Discord

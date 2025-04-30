# Decentralized Voting App (Next.js Frontend)

A modern frontend for interacting with an Ethereum-based decentralized voting smart contract.

## Features
- Connect Ethereum wallets (using ethers.js)
- View and participate in decentralized voting
- Modern UI with Tailwind CSS
- Dark/Light theme support
- Responsive design for all devices

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourname/decentralized-vote.git
   cd decentralized-vote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with:
   ```env
    NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
    NEXT_PUBLIC_CONTRACT_ADDRESS=0x344C7E3F2fed27D26216CAfA4FfEf79b561Ce210
    WALLET_PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
   ```

## Usage

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Dependencies

- **Next.js 15** - React framework
- **ethers.js** - Ethereum interaction library
- **Web3Modal** - Wallet connection
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components

## Requirements

- Node.js 18+
- Ethereum wallet (MetaMask, WalletConnect, etc.)
- Testnet ETH (for voting on test networks)
- PeraWallet mobile app

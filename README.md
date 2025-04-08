# Decentralized Voting App (Next.js Frontend)

A frontend for interacting with the Algorand voting smart contract.

## Features

- Connect Algorand wallets (using Pera Wallet)
- View and participate in decentralized voting
- Modern UI with Tailwind CSS
- Theming support

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/M-AnasGit/decentralized-vote.git
    cd decentralized-vote
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file with:
    ```env
    NEXT_PUBLIC_ALGOD_URL=https://testnet-api.algonode.cloud
    NEXT_PUBLIC_APP_ID=737061610
    ```

`737061610` is the application id of the app made during development. If you want to make your own go to the `smart-contract` branch.

## Usage

1. Start development server:

    ```bash
    npm run dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Dependencies

- **Next.js 15** - React framework
- **algosdk** - Algorand SDK
- **Pera Wallet** - Wallet connection
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components

## Requirements

- Node.js
- Algorand Testnet account (for voting)
- Pera Wallet mobile app (for mobile users)

# Algorand Smart Contract Deployment Tool

A simple tool to compile and deploy Algorand smart contracts (TEAL programs) and fetch application details.

## Features

-   Compile TEAL programs
-   Deploy smart contracts to Algorand blockchain
-   Fetch and display application details

## Installation

1. Clone this repository:

    ```bash
    git clone -b smart-contract https://github.com/M-AnasGit/decentralized-vote.git
    cd decentralized-vote
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with these variables:
    ```
    ALGOD_API_URL="https://testnet-api.algonode.cloud"
    MNEMONIC="your 25-word mnemonic"
    ```

## Usage

### 1. Deploy a Smart Contract

1. Place your TEAL files (`vote.teal` and `clear.teal` in this case) in the project root
2. Run the dev script:
    ```bash
    npm run dev
    ```

### 2. Fetch Application Details

After deployment, you'll get an Application ID. To check its details:

1. Add the APP_ID to your `.env` file:
    ```
    APP_ID="your-application-id"
    ```
2. Run the fetch script:
    ```bash
    npm run fetch
    ```
    (Make sure your `package.json` has a "fetch" script pointing to `fetch-application.ts`)

## Files Explained

-   `compile.ts` - Compiles TEAL programs
-   `index.ts` - Main deployment script
-   `fetch-application.ts` - Fetches and displays application details

## Requirements

-   Node.js
-   Algorand SDK
-   Access to an Algorand node (Testnet/Mainnet/Local)

Note: This is a basic tool for development purposes. Always secure your mnemonic and API credentials.

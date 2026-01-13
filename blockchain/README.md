# EduConnect Blockchain (Hardhat)

Smart Contracts for certificate management built with Hardhat.

## Prerequisites
- Node.js (v18+)

## Installation

```bash
cd blockchain
npm install
```

## Running Local Node

Start a local Ethereum node:

```bash
npx hardhat node
```

This will spin up a local blockchain on `http://127.0.0.1:8545` with 20 pre-funded accounts.

## Deployment

Deploy contracts to the local node:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

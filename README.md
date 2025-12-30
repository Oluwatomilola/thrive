 **Thrive is a staking dApp built with Clarity and WalletConnect**.

# 🪙 Stacks Staking dApp (Clarity + WalletConnect)

A decentralized staking application built on **Stacks**, using **Clarity smart contracts** and **WalletConnect** for secure wallet interactions.
The app allows users to stake STX, earn rewards, and unstake — all through a clean, connected web interface.

---

## 🚀 Overview

This project demonstrates  a **full-stack staking dApp** on Stacks using:

* **Clarity (v4)** for the smart contract
* **WalletConnect** for wallet authentication & transaction signing
* **React** for the frontend
* **Node.js** for backend utilities (optional)

The focus is on **clarity, correctness, and real-world usability** rather than complex DeFi mechanics.

---

## ✨ Features

* 🔐 Wallet connection via **WalletConnect**
* 💰 Stake STX into a smart contract
* 🔁 Unstake and receive rewards
* 📡 On-chain event tracking using `print`
* ⚡ Real-time UI updates
* 🧩 Clean, modular architecture

---

## 🏗️ Architecture Overview

```
┌──────────────┐
│   Frontend   │  ← React + WalletConnect
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stacks RPC  │  ← Transaction submission
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Smart Contract│  ← Clarity (staking logic)
└──────────────┘
```

Optional (for analytics / live updates):

```
Smart Contract → Chainhooks → Backend → Frontend
```

---

## 📁 Project Structure

```
.
├── contracts/
│   └── staking.clar
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── wallet.js
│   │   └── api.js
│   └── index.html
│
├── backend/ (optional)
│   └── server.js
│
└── README.md
```

---

## 🧠 Smart Contract Overview

### Core Capabilities

* Accepts STX deposits
* Tracks user stake balances
* Issues rewards on unstake
* Emits structured events for off-chain tracking

### Example Event Emission

```clarity
(print {
  event: "stake",
  user: tx-sender,
  amount: amount,
  block: block-height
})
```

### Key Properties

* Written in **Clarity 4**
* Deterministic and auditable
* No admin privileges
* No hidden state changes

---

## 🔐 Wallet Integration (WalletConnect)

The frontend uses **WalletConnect** to:

* Connect users’ Stacks wallets (e.g., Leather)
* Request transaction signatures
* Submit contract calls securely

### Supported Actions

* Connect / Disconnect wallet
* Stake STX
* Unstake STX
* Read on-chain balances

---

## 🖥 Frontend Functionality

### UI Features

* Wallet connection status
* Stake input field
* Stake / Unstake buttons
* Display of recent staking activity
* Live refresh from on-chain data

### Data Flow

```
User → WalletConnect → Stacks Network → Contract
                                  ↓
                             UI Refresh
```

---

## 🧪 Local Development

### Prerequisites

* Node.js ≥ 18
* Clarinet
* Stacks Wallet (Leather recommended)

---

### 1️⃣ Run the Smart Contract

```bash
clarinet check
clarinet console
```

---

### 2️⃣ Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 3️⃣ Connect Wallet

* Open browser
* Connect via WalletConnect
* Approve transactions in wallet

---

## 🔒 Security Notes

* This project is for **educational/demo purposes**
* No audits have been performed
* Rewards are paid from contract balance
* No slashing or lock-up mechanisms
* Do not use with real funds without review

---

## 📈 Possible Enhancements

* Time-based staking rewards
* SIP-010 token staking
* Persistent backend storage
* WebSocket event streaming
* Multi-wallet support
* Governance voting

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## ✅ Summary

This project demonstrates how to:

✔ Build a Clarity smart contract
✔ Connect wallets securely using WalletConnect
✔ Stake and unstake STX
✔ React to on-chain events
✔ Build a clean, user-facing dApp



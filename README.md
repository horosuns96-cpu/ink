<div align="center">

# 🚀 InkLaunch Protocol

**Multichain no-code ERC-20 token factory — Ink Sepolia & Base Sepolia**

[![Testnet](https://img.shields.io/badge/network-Ink%20Sepolia-7F77DD?style=flat-square)](https://explorer-sepolia.inkonchain.com)
[![Base](https://img.shields.io/badge/network-Base%20Sepolia-0052FF?style=flat-square)](https://sepolia.basescan.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-1D9E75?style=flat-square)](LICENSE)
[![WalletConnect](https://img.shields.io/badge/RainbowKit-v2-7F77DD?style=flat-square)](https://www.rainbowkit.com)

Connect your wallet → configure your token → deploy. No Solidity knowledge required.

[**Live Demo**](https://inklaunch.vercel.app) · [**Ink Explorer**](https://explorer-sepolia.inkonchain.com) · [**Base Explorer**](https://sepolia.basescan.org) · [**Get Testnet ETH**](https://inkonchain.com/faucet)

</div>

---

## 🌐 Multichain Support

| Network | Chain ID | Factory Contract | Status |
|---|---|---|---|
| **Ink Sepolia** | 763373 | [`0x0BEb9438...`](https://explorer-sepolia.inkonchain.com/address/0x0BEb9438A24d119d600158F2CB829F461f5eFf5C) | ✅ Live + Verified |
| **Base Sepolia** | 84532 | deploy pending | 🔜 Coming Soon |
| **Base Mainnet** | 8453 | — | 📋 Planned |

---

## ✨ Features

| | |
|---|---|
| ⚡ **One-click deploy** | Deploy a fully functional ERC-20 token in seconds via audited factory contract |
| 📊 **Command Center** | Dashboard with all deployed tokens, ownership tracking, search & sort |
| 🔗 **Multi-wallet** | MetaMask, Coinbase, Rainbow, Trust Wallet, WalletConnect QR and more |
| ⚠️ **Wallet note** | Recommended: MetaMask or Coinbase Wallet browser extension. Mobile wallets may not support Ink Sepolia yet. |
| 🌌 **Space UI** | Dark cosmic theme · aurora effects · starfield background · 3D tilt cards · cursor trail |
| 🛡 **Session recovery** | Auto-reconnect with WalletConnect session error handling & cleanup |
| 🔍 **On-chain indexing** | Reads `TokenCreated` events to accurately track tokens you deployed |

---

## 🖥 Pages

### `/` — Landing
Animated hero with starfield, aurora gradient, feature highlights and CTA to launch.

### `/launch` — Deploy Token
Form to set token name, symbol, and initial supply. Deploys via factory contract with live tx feedback.

### `/dashboard` — Command Center
- Stats: ETH balance · total contracts · your contracts · network status
- Grid of all tokens deployed via factory
- Ownership via `TokenCreated` event filtering (accurate even after transferring tokens)
- Search by address · sort newest/oldest · copy address · add to wallet · open explorer

---

## 🛠 Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

**Web3**
- [wagmi v2](https://wagmi.sh)
- [viem](https://viem.sh)
- [RainbowKit](https://www.rainbowkit.com)
- [@tanstack/react-query](https://tanstack.com/query)

**Network**
- [Ink Sepolia](https://inkonchain.com) — Chain ID `763373`

---

## 🌐 Network Config

```
Network:  Ink Sepolia (Testnet)
Chain ID: 763373
RPC:      https://rpc-gel-sepolia.inkonchain.com
Explorer: https://explorer-sepolia.inkonchain.com
Faucet:   https://faucet.inkonchain.com
```

---

## 🔌 Supported Wallets

| Wallet | Desktop | Mobile |
|--------|---------|--------|
| 🦊 MetaMask | ✅ Extension | ✅ WalletConnect QR |
| 🔵 Coinbase Wallet | ✅ Extension | ✅ WalletConnect QR |
| 🌈 Rainbow | ✅ Extension | ✅ Deep link |
| 🛡 Trust Wallet | — | ✅ Deep link / WC QR |
| 🔗 WalletConnect | ✅ QR fallback | ✅ Any WC-compatible |
| 🔒 Safe (Gnosis) | ✅ Multisig | — |

> **Note:** Mobile wallets require HTTPS. They work on the deployed version but not on `http://localhost`.

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/horosuns96-gpu
cd inklaunch

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> Get your free Project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

```bash
# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/inklaunch)

1. Import repo on [vercel.com](https://vercel.com)
2. Add environment variable:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_id_here
   ```
3. Deploy — Vercel auto-detects Next.js, no config needed

---

## 📁 Project Structure

```
inklaunch/
├── app/
│   ├── page.tsx              # Landing page
│   ├── launch/page.tsx       # Token deploy form
│   └── dashboard/page.tsx    # Command center
├── components/
│   ├── Web3Inner.tsx         # wagmi + RainbowKit config
│   ├── BalanceProvider.tsx   # Global ETH balance context
│   └── ...
├── lib/
│   └── contracts.ts          # Factory ABI + address
└── .env.example
```

---

## 📄 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ Yes | From [cloud.walletconnect.com](https://cloud.walletconnect.com) |

---

## 📜 License

MIT — feel free to fork and build on top.

---

<div align="center">

Built for the **Ink Sepolia** ecosystem · Powered by RainbowKit + wagmi + viem

</div>

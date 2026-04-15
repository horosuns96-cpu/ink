<div align="center">

<img src="https://img.shields.io/badge/InkLaunch-Protocol-7F77DD?style=for-the-badge&logoColor=white" alt="InkLaunch" />

# InkLaunch Protocol

**Multichain no-code ERC-20 token factory**

[![Ink Sepolia](https://img.shields.io/badge/Ink%20Sepolia-Live-7F77DD?style=flat-square&logo=ethereum&logoColor=white)](https://explorer-sepolia.inkonchain.com)
[![Base Sepolia](https://img.shields.io/badge/Base%20Sepolia-Live-0052FF?style=flat-square&logo=coinbase&logoColor=white)](https://sepolia.basescan.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![wagmi](https://img.shields.io/badge/wagmi-v2-1C1C1C?style=flat-square)](https://wagmi.sh)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

> Connect your wallet → configure your token → deploy in seconds.  
> No Solidity knowledge required.

[**🌐 Live App**](https://ink-theta.vercel.app) · [**Ink Explorer**](https://explorer-sepolia.inkonchain.com) · [**Base Explorer**](https://sepolia.basescan.org) · [**Get Testnet ETH**](https://inkonchain.com/faucet)

</div>

---

## 🌐 Deployed Contracts

| Network | Chain ID | Factory Address | Explorer |
|---------|----------|-----------------|---------|
| **Ink Sepolia** | `763373` | `0x0BEb9438A24d119d600158F2CB829F461f5eFf5C` | [View ↗](https://explorer-sepolia.inkonchain.com/address/0x0BEb9438A24d119d600158F2CB829F461f5eFf5C) |
| **Base Sepolia** | `84532` | `0xe584C914413457cd7b6a310a17A449135415F1c3` | [View ↗](https://sepolia.basescan.org/address/0xe584C914413457cd7b6a310a17A449135415F1c3) |
| **Base Mainnet** | `8453` | — | Planned |

---

## ✨ Features

- **⚡ One-click deploy** — Launch a fully compliant ERC-20 in seconds via an audited factory contract
- **🌐 Multichain** — Native support for Ink Sepolia and Base Sepolia from a single UI
- **📊 Command Center** — Dashboard with live token stats, ownership tracking, search and sort
- **🔍 On-chain indexing** — Paginated `TokenCreated` event scanning to accurately track tokens you deployed across any block range
- **✨ Based Name Generator** — Instant name suggestions with a non-repeating deck of 25 curated crypto names
- **� Superchain Speed Mode** — 3-step visual deploy progress: Wallet → Broadcast → Indexing
- **💎 Add to Wallet** — One-click `wallet_watchAsset` to add your deployed token straight to MetaMask
- **�📤 Token Card** — After deploy: copy contract address, share on X, block explorer, token explorer
- **🔗 Multi-wallet** — MetaMask, Coinbase Wallet, Rainbow, WalletConnect (QR), Zerion, injected
- **🔁 Chain switcher** — Switch between Ink and Base directly from the profile dropdown
- **🛡 Session recovery** — Auto-reconnect + WalletConnect session error cleanup
- **🌌 Immersive UI** — Dark cosmic theme · aurora gradient · animated starfield · 3D tilt cards

---

## 🖥 Pages

### `/` — Landing
Live multichain token counter (Ink + Base combined), animated hero, feature bento grid.

### `/launch` — Token Compiler
- Name, symbol (A–Z only, 2–6 chars), initial supply with overflow guard
- Live preview card that reflects the connected network
- Post-deploy: contract address · Block Explorer · Share on X · Token Explorer

### `/dashboard` — Command Center
- Stats: ETH balance · total tokens · your tokens · network status
- Search by address · sort by newest / oldest / **mine** (your deployed tokens)
- Copy address · Add to wallet (MetaMask) · Open on explorer
- Ownership tracked via `TokenCreated` event logs (chain-aware, paginated)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 14](https://nextjs.org) (App Router, `'use client'`) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Web3 | [wagmi v2](https://wagmi.sh) + [viem](https://viem.sh) |
| Wallet UI | [RainbowKit v2](https://www.rainbowkit.com) |
| Data fetching | [@tanstack/react-query v5](https://tanstack.com/query) |
| Contracts | Hardhat · Solidity 0.8.20 |

---

## 🔌 Supported Wallets

| Wallet | Desktop | Mobile |
|--------|---------|--------|
| 🦊 MetaMask | ✅ Extension | ✅ Best mobile option |
| 🔵 Coinbase Wallet | ✅ Extension | ⚠️ Base Sepolia only |
| 🌈 Rainbow | ✅ Extension | ⚠️ Base Sepolia only |
| 🔗 WalletConnect | ✅ QR | ⚠️ Base Sepolia only |
| ⬡ Zerion | ✅ Extension | ⚠️ Base Sepolia only |
| � Injected | ✅ Any browser wallet | — |

> **Mobile note:** Ink Sepolia (`763373`) is a custom testnet not in the WalletConnect chain registry. Mobile wallets connect to **Base Sepolia** by default. To use Ink Sepolia on mobile, add the network manually in **MetaMask Mobile**:
> ```
> RPC:      https://rpc-gel-sepolia.inkonchain.com
> Chain ID: 763373  |  Symbol: ETH
> Explorer: https://explorer-sepolia.inkonchain.com
> ```

---

## 🌐 Network Configuration

**Ink Sepolia**
```
Chain ID: 763373
RPC:      https://rpc-gel-sepolia.inkonchain.com
Explorer: https://explorer-sepolia.inkonchain.com
Faucet:   https://inkonchain.com/faucet
```

**Base Sepolia**
```
Chain ID: 84532
RPC:      https://sepolia.base.org
Explorer: https://sepolia.basescan.org
Faucet:   https://faucet.quicknode.com/base/sepolia
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/horosuns96-cpu/ink.git
cd ink

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> Get a free Project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

```bash
# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/horosuns96-cpu/ink)

1. Import the repo on [vercel.com](https://vercel.com)
2. Add the environment variable:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_id_here
   ```
3. Deploy — Vercel auto-detects Next.js, no extra config needed

---

## 📁 Project Structure

```
ink/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing — hero + bento grid + live stats
│   │   ├── launch/page.tsx       # Token deploy form + live preview
│   │   └── dashboard/page.tsx    # Command center — all tokens + mine filter
│   ├── components/
│   │   ├── Web3Inner.tsx         # wagmi + RainbowKit config
│   │   ├── Header.tsx            # Nav + profile dropdown + chain switcher
│   │   ├── Footer.tsx            # Multichain ecosystem links
│   │   ├── BalanceProvider.tsx   # Global ETH balance context
│   │   └── IntroSequence.tsx     # Animated intro overlay
│   └── lib/
│       └── contracts.ts          # Factory ABI + multichain address map
├── contracts/
│   ├── contracts/InkFactory.sol  # ERC-20 factory contract (Solidity 0.8.20)
│   ├── scripts/deploy.ts         # Hardhat deploy script
│   └── hardhat.config.ts         # Ink Sepolia + Base Sepolia networks
└── .env.example
```

---

## 📄 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ | From [cloud.walletconnect.com](https://cloud.walletconnect.com) |

---

## 📜 License

MIT — free to fork, extend, and build on top.

---

<div align="center">

Built for the **Ink** and **Base** ecosystems · Powered by RainbowKit + wagmi + viem

</div>

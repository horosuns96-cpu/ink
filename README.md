<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" alt="InkLaunch Logo" width="120" height="120">
  <h1>InkLaunch</h1>
  <p><strong>The fastest way to deploy ERC-20 tokens on Ink Sepolia. No code required.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Network-Ink%20Sepolia-blue?style=flat-square" alt="Network">
    <img src="https://img.shields.io/badge/Framework-Next.js-black?style=flat-square" alt="Next.js">
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-06b6d4?style=flat-square" alt="Tailwind">
    <img src="https://img.shields.io/badge/Web3-Wagmi%20%2B%20RainbowKit-purple?style=flat-square" alt="Web3">
  </p>
</div>

---

## 🌟 Overview

**InkLaunch** is a production-ready token factory built specifically for the **Ink Ecosystem**. It allows anyone to instantly deploy fully compliant ERC-20 tokens directly from their browser or mobile wallet. 

Built with an obsessive focus on UX and performance, InkLaunch eliminates the technical barriers of smart contract deployment, allowing builders to focus on community and utility.

## ✨ Features

- **🚀 10-Second Deployments:** Launch a fully functional ERC-20 token in seconds.
- **📱 Universal Wallet Support:** Integrated deeply with RainbowKit & WalletConnect v2 for flawless desktop and mobile onboarding.
- **💎 Premium UX/UI:** Fluid animations (Framer Motion), glassmorphism design, and interactive feedback (Canvas Confetti).
- **🛡️ Built-in Safeguards:** Real-time form validation, automatic network switching, and "zero balance" gas faucets.
- **💼 Token Management:** Built-in Dashboard to track all deployed tokens, check balances, and 1-click "Add to Wallet" via `watchAsset`.
- **⚡ Next-Gen Tech Stack:** Powered by Next.js 14, viem, wagmi v2, and customized Tailwind.

## 🏗️ Architecture

InkLaunch relies on a single, highly optimized, pre-audited Smart Contract acting as a Factory on the Ink Sepolia Testnet.

**Ink Factory Contract:** `0x0BEb9438A24d119d600158F2CB829F461f5eFf5C`

When a user submits the form, the Factory contract deploys a new standard ERC-20 clone on behalf of the user, assigning them 100% of the initial supply and setting them as the owner.

## 🛠️ Quick Start

Want to run InkLaunch locally? It's plug-and-play.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ink-quicklaunch.git
cd ink-quicklaunch

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
Navigate to `http://localhost:3000`. No `.env` configuration is strictly required to run the frontend.

## 🏆 Ink Spark Grant

This project is built for the **Ink Builder Program - Spark**.

**Why InkLaunch deserves the Spark Grant:**
1. **Public Good:** Provides immediate utility to other developers and creators entering the Ink ecosystem.
2. **High Quality:** Focuses on a premium, consumer-grade experience over a simple MVP. It just works.
3. **Scalable:** The underlying architecture (App Router, Viem, React Query) is ready for Mainnet scaling.

## 📄 License

MIT License - free to use, modify, and distribute. Built for the Ink Community.

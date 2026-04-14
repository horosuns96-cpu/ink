# InkLaunch — Ink Spark Builder Program Application

---

## Project Description

InkLaunch is a no-code ERC-20 token deployment tool built natively on Ink Sepolia.
A user connects their wallet, fills in three fields (name, symbol, supply), and has a
live token contract on Ink in under 30 seconds — no Solidity, no CLI, no setup required.

The frontend is built with Next.js 14, wagmi v2, and viem, communicating with a factory
smart contract deployed at `0x0BEb9438A24d119d600158F2CB829F461f5eFf5C` on Ink Sepolia.
On-chain `TokenCreated` event indexing gives users an accurate dashboard of contracts
they've deployed, with multicall batch reads for real-time token data.

The project is live, open source (MIT), and free to use. No backend, no database —
everything runs on-chain and client-side.

**Live:** https://inklaunch.vercel.app
**Repo:** https://github.com/horosuns96-cpu/ink

---

## Traction

- **12 ERC-20 tokens** deployed via factory contract since launch
- **4 unique wallet addresses** have interacted with the protocol
- **13 on-chain transactions** recorded on Ink Sepolia
- Factory contract: [`0x0BEb9438A24d119d600158F2CB829F461f5eFf5C`](https://explorer-sepolia.inkonchain.com/address/0x0BEb9438A24d119d600158F2CB829F461f5eFf5C)
- Fully functional testnet MVP — no placeholder UI, no fake demo data

*These are real early-stage testnet numbers from a project launched less than a week ago.
The goal isn't scale yet — it's proving the feedback loop works and real users can deploy
tokens on Ink without friction.*

---

## Use Cases

**1. Developer testing tokenomics**
A DeFi builder wants to test liquidity pool mechanics on Ink before writing a full token
contract. They deploy a test ERC-20 in 30 seconds, add it to a local fork, iterate.
No time wasted on boilerplate.

**2. Community and experimental token launches**
A small community wants to create a token for internal use — governance experiment,
loyalty points, hackathon reward. InkLaunch lets them do it without hiring a Solidity dev.
The token is real, on-chain, and transferable immediately.

**3. Onboarding non-technical users to Ink**
A user new to Web3 learns what a token is by actually deploying one. They see their
contract on the explorer, add it to MetaMask, and understand the mechanics firsthand.
This is the most direct onboarding path Ink currently has for non-developers.

---

## Why It Matters for Ink

Ink is a new L2. The ecosystem tooling is sparse — there is no equivalent of Remix +
OpenZeppelin wizard that is purpose-built for Ink and accessible to non-technical users.

InkLaunch fills that gap today:

- **Reduces time-to-first-deployment** for both developers and newcomers
- **Generates real on-chain activity** — every deploy is a real Ink transaction
- **Lowers the knowledge barrier** — the single biggest obstacle to ecosystem growth
- **Provides a reusable foundation** — the factory contract and dashboard can be extended
  for more complex token types without rebuilding the infrastructure

Every user who deploys a token on InkLaunch is a user who touched Ink for the first time,
or a developer who chose Ink over another testnet. That is direct ecosystem growth.

**This is NOT a speculative token launcher.**
InkLaunch is designed for testing, prototyping, and onboarding. There is no built-in
trading, no liquidity features, no promotion mechanism. It is a developer and builder
tool first — the equivalent of a scaffold, not a launchpad.

---

## Roadmap (Grant Usage)

**Phase 1 — Mainnet (Month 1–2)**
- Deploy factory contract to Ink mainnet
- Update frontend config, test full flow end-to-end on mainnet
- Add mainnet/testnet toggle in UI

**Phase 2 — Token Features (Month 2–3)**
- Mintable / burnable token options in the deploy form
- Initial supply lock / vesting config (basic)
- Custom decimals support

**Phase 3 — Dashboard & Analytics (Month 3–4)**
- Global token feed — all tokens ever deployed, not just yours
- Per-token analytics: transfer count, holder count (via event logs)
- Token verification badge for factory-deployed contracts

**Phase 4 — Ecosystem Integrations (Month 4+)**
- Integration with Ink-native DEX (if available) for instant liquidity option
- WalletConnect deeplink improvements for mobile users on Ink
- Developer API / SDK for factory contract (for builders who want to embed the deployer)

---

## Team

Solo builder. Full-stack Web3 developer.
Stack: Next.js, TypeScript, Solidity, wagmi, viem, RainbowKit, Tailwind, Framer Motion.
Built and shipped the full MVP — smart contract + frontend + performance optimization —
independently.

---

## Budget Request

Requested: **$2,000**

Breakdown:
- Mainnet contract deployment + security review: ~$300
- 6 weeks development (Phase 1–2: mainnet support + token features): ~$1,500
- Infrastructure 6 months (Vercel, RPC node, domain): ~$200

---

## Summary

InkLaunch is the fastest way for any user — developer or not — to put a real token on Ink.
It is live, functional, and already generating on-chain activity.
The grant will be used to ship mainnet support and expand token capabilities for builders
who want to prototype and experiment on Ink.

No fluff. One click. Real contracts.

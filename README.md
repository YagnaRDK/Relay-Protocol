<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2MzY2QyZjVjZTU0ZmRhMjRjZTkwNjFiZDFiOWYxN2UzZjJkNzBmYiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="AI Agent Network Banner" width="600" style="border-radius: 10px;"/>

  <br />
  <br />

# ⚡ Relay Protocol

**The Global Agent-to-Agent Gig Economy.** _Built for the ETHGlobal Open Agents 2026 Hackathon._

  <p align="center">
    <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  </p>
</div>

---

## 🚀 The Vision

The next trillion internet users won't be human—they will be AI agents. Currently, agents hallucinate and fail because they are forced to browse software designed for human eyes (buttons, forms, UIs).

**Relay Protocol** is a completely headless, machine-readable infrastructure layer that allows AI agents to hire each other globally. It enables a localized, private agent to broadcast a JSON-formatted bounty over a peer-to-peer network, hire a specialized worker agent to execute the task, and pay them instantly on-chain upon verified delivery.

**Zero human UI. Pure machine-to-machine commerce.**

---

## 🏆 ETHGlobal Sponsor Tracks

Relay Protocol is specifically architected to leverage these core technologies:

- **🌐 Gensyn (Best Application of AXL):** The entire protocol runs on Gensyn's AXL. Agents broadcast jobs and negotiate peer-to-peer over the encrypted mesh network without a central server.
- **⚙️ KeeperHub (Best Integration):** Serves as our decentralized escrow and execution engine. Funds are locked into a Unichain smart contract via KeeperHub's API and only released when the deterministic payload is successfully delivered.
- **🗄️ 0G (Decentralized AI OS / Swarms):** All successful task receipts are cryptographically hashed and logged to 0G Storage, acting as an immutable reputation ledger (a "resume") for Worker agents.
- **🦄 Uniswap Foundation:** Micro-payments and escrow smart contracts are deployed natively on **Unichain**.

---

## 🏗 Architecture & Flow

### 1. The Protocol Lifecycle

When an agent hits a dead-end, it delegates the work:

1. **Broadcast:** The Requester Agent locks funds in a Unichain Escrow and broadcasts a strict Zod-validated JSON bounty to Gensyn AXL.
2. **Execution:** A specialized Worker Agent accepts the job over the mesh network and computes the result.
3. **Settlement:** The Worker returns the data payload. Upon verification, KeeperHub triggers the smart contract to release the funds, and the successful job is logged to 0G Storage.

### 2. System Architecture

<div align="center">
  <img src="assets/flowchart.png" alt="Relay Architecture Diagram" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 20px 0;"/>
</div>

### 3. Protocol Sequence

<div align="center">
  <img src="assets/sequence.png" alt="Relay Sequence Diagram" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 20px 0;"/>
</div>

### 4. Data Entity Relationships

<div align="center">
  <img src="assets/entity-relationship.png" alt="Relay Entity Relationship Diagram" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 20px 0;"/>
</div>

---

## 🛠 Tech Stack

| Category               | Technology                              |
| :--------------------- | :-------------------------------------- |
| **Monorepo / Runtime** | `Bun`, `Turborepo` architecture         |
| **Agents / Logic**     | `Node/Bun Daemon`, `TypeScript`, `Zod`  |
| **Web3 & Storage**     | `Gensyn AXL`, `KeeperHub`, `0G Storage` |
| **Smart Contracts**    | `Foundry`, `Solidity`, `Unichain`       |
| **Spectator UI**       | `Next.js 15`, `TailwindCSS`             |

---

## 📂 Repository Structure

```text
relay-protocol/
├── apps/
│   ├── web-dashboard/        # Visualizer for the judges to watch the network
│   ├── worker-daemon/        # Headless remote worker agent (listens for jobs)
│   └── requester-client/     # Local agent (broadcasts intents and locks funds)
├── packages/
│   ├── core-sdk/             # Wrapper for Gensyn, KeeperHub, and 0G
│   ├── contracts/            # Unichain Escrow Smart Contracts (Foundry)
│   └── validation/           # Shared Zod schemas ensuring agents speak the same language
└── package.json              # Bun workspace configuration

```

## 👨‍💻 About the Builder

**I am a builder. That's it. I build things.** Whether it is localized AI orchestration, decentralized gig economies, or autonomous protocol infrastructure, my focus is singular: writing code that works and shipping systems that scale.

### Let's Connect

<p align="left">
  <a href="https://yagna.rocks/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=globe&logoColor=white" alt="Website"/>
  </a>
  <a href="https://github.com/YagnaRDK/" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://x.com/YagnaRDK" target="_blank">
    <img src="https://img.shields.io/badge/X_Twitter-000000?style=for-the-badge&logo=x&logoColor=white" alt="X (Twitter)"/>
  </a>
  <a href="https://www.linkedin.com/in/YagnaRDK/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="https://instagram.com/yagna.rdk" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/>
  </a>
  <a href="mailto:hello@yagna.rocks">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
  </a>
</p>

> _"Building infrastructure that agents actually want to use."_

---

_Built with ❤️ for ETHGlobal Open Agents 2026_

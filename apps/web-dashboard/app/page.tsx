"use client";

import { useState } from "react";

export default function SpectatorDashboard() {
  const [status, setStatus] = useState<
    "IDLE" | "LOCKING" | "EXECUTING" | "SETTLING" | "COMPLETED"
  >("IDLE");
  const [taskId, setTaskId] = useState<string>("-");
  const [lockTx, setLockTx] = useState<string>("-");
  const [zeroGHash, setZeroGHash] = useState<string>("-");
  const [releaseTx, setReleaseTx] = useState<string>("-");
  const [workerId, setWorkerId] = useState<string>("-");

  // Interactive UI State
  const [taskInstructions, setTaskInstructions] = useState(
    "Extract yield APYs from Aura smart contracts",
  );
  const [bountyAmount, setBountyAmount] = useState("0.0005");

  const runProtocol = async () => {
    if (!taskInstructions || !bountyAmount)
      return alert("System Error: Parameters missing.");

    setStatus("LOCKING");
    setTaskId("-");
    setLockTx("-");
    setZeroGHash("-");
    setReleaseTx("-");
    setWorkerId("-");

    try {
      const reqRes = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskInstructions, bountyAmount }),
      });
      const reqData = await reqRes.json();
      if (!reqData.success) throw new Error("Lock failed");

      setTaskId(reqData.taskId);
      setLockTx(reqData.lockTx);
      setStatus("EXECUTING");

      const workerRes = await fetch("/api/worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: reqData.taskId }),
      });
      const workerData = await workerRes.json();
      if (!workerData.success) throw new Error("Worker failed");

      setWorkerId(workerData.workerAddress);
      setZeroGHash(workerData.zeroGHash);
      setStatus("SETTLING");

      await new Promise((r) => setTimeout(r, 1000));

      setReleaseTx(workerData.releaseTx);
      setStatus("COMPLETED");
    } catch (error) {
      console.error(error);
      setStatus("IDLE");
      alert(
        "FATAL EXCEPTION: Protocol execution aborted. Check terminal logs.",
      );
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-12 flex flex-col items-center pb-24">
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        {/* Header & Install Command */}
        <header className="text-center space-y-4 md:space-y-6 pt-4 md:pt-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.3)] leading-tight">
            HIRE AGENTS. <br className="md:hidden" />
            <span className="text-red-600">ON-CHAIN.</span>
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm max-w-2xl mx-auto uppercase tracking-wide px-4">
            The decentralized execution layer for AI swarms.
          </p>

          <div className="flex flex-col items-center justify-center space-y-2 mt-4">
            <div className="flex items-center bg-black border border-neutral-800 rounded-sm p-1 shadow-[0_0_15px_rgba(220,38,38,0.05)] w-full max-w-sm md:max-w-md justify-between">
              <div className="flex items-center pl-3">
                <span className="text-neutral-600 mr-2 md:mr-3">{`>`}</span>
                <code className="text-neutral-400 text-xs md:text-sm tracking-tight select-none">
                  bun add @relay/core-sdk
                </code>
              </div>
              <button
                disabled
                className="bg-neutral-950 text-neutral-600 border border-neutral-900 px-3 py-2 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest cursor-not-allowed"
              >
                COPY
              </button>
            </div>
            <span className="text-[10px] md:text-xs text-red-500/50 uppercase tracking-widest font-bold">
              * NPM Package strictly in private beta for hackathon
            </span>
          </div>
        </header>

        {/* 1. Command Center Controls */}
        <div className="bg-black border border-red-900/40 p-5 md:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900 opacity-50"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] md:text-xs text-red-500/70 uppercase tracking-widest">
                Task Intent (Zod Schema)
              </label>
              <input
                type="text"
                value={taskInstructions}
                onChange={(e) => setTaskInstructions(e.target.value)}
                disabled={status !== "IDLE" && status !== "COMPLETED"}
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-500 p-3 text-xs md:text-sm text-red-50 disabled:opacity-50 transition-colors outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs text-red-500/70 uppercase tracking-widest">
                Bounty (ETH)
              </label>
              <input
                type="number"
                step="0.0001"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                disabled={status !== "IDLE" && status !== "COMPLETED"}
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-red-500 p-3 text-xs md:text-sm text-red-50 disabled:opacity-50 transition-colors outline-none"
              />
            </div>
          </div>

          <button
            onClick={runProtocol}
            disabled={status !== "IDLE" && status !== "COMPLETED"}
            className="w-full relative group bg-red-600 hover:bg-red-500 disabled:bg-neutral-900 disabled:text-neutral-600 text-white px-4 py-3 md:px-6 md:py-4 font-bold text-sm md:text-lg transition-all disabled:border disabled:border-neutral-800"
          >
            {status === "IDLE" || status === "COMPLETED"
              ? `[ EXECUTE PROTOCOL ]`
              : `[ ${status} ] Automating Protocol...`}
          </button>
        </div>

        {/* 2. Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <StatusCard
            title="1. UNICHAIN LOCK"
            active={status === "LOCKING"}
            done={
              status === "EXECUTING" ||
              status === "SETTLING" ||
              status === "COMPLETED"
            }
            value={lockTx}
            link={`https://unichain-sepolia.blockscout.com/tx/${lockTx}`}
          />
          <StatusCard
            title="2. 0G DATA PROOF"
            active={status === "EXECUTING"}
            done={status === "SETTLING" || status === "COMPLETED"}
            value={zeroGHash}
            link={`https://storagescan-galileo.0g.ai/tx/${zeroGHash}`}
          />
          <StatusCard
            title="3. UNICHAIN SETTLEMENT"
            active={status === "SETTLING"}
            done={status === "COMPLETED"}
            value={releaseTx}
            link={`https://unichain-sepolia.blockscout.com/tx/${releaseTx}`}
          />
        </div>

        {/* 3. Live Hacker Console */}
        <div className="bg-[#050505] border border-neutral-800 p-4 md:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-4 md:mb-6 pb-4 border-b border-neutral-900">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-neutral-700"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-neutral-700"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-red-600 animate-pulse"></div>
            <span className="ml-2 md:ml-4 text-[10px] md:text-xs text-neutral-500 tracking-widest">
              system_monitor.sh
            </span>
          </div>

          <div className="space-y-2 md:space-y-3 text-[10px] md:text-sm font-mono break-all md:break-normal">
            <LogLine
              show={status !== "IDLE"}
              msg={`[SYSTEM] Analyzing intent: "${taskInstructions}"`}
            />
            <LogLine
              show={status !== "IDLE"}
              msg={`[UNICHAIN] Securing bounty of ${bountyAmount} ETH...`}
            />
            <LogLine
              show={
                status === "EXECUTING" ||
                status === "SETTLING" ||
                status === "COMPLETED"
              }
              msg={`[UNICHAIN] ✅ SUCCESS: Escrow locked. Task UUID: ${taskId}`}
              highlight
            />

            <LogLine
              show={
                status === "EXECUTING" ||
                status === "SETTLING" ||
                status === "COMPLETED"
              }
              msg={`[GENSYN] 📡 Broadcasting to mesh network... Job accepted by Worker ${workerId}`}
            />
            <LogLine
              show={status === "SETTLING" || status === "COMPLETED"}
              msg={`[0G STORAGE] 📦 Payload cryptographically hashed. Proof verified.`}
            />

            <LogLine
              show={status === "SETTLING" || status === "COMPLETED"}
              msg={`[KEEPERHUB] 🔐 Conditions met. Authorizing Unichain release...`}
            />
            <LogLine
              show={status === "COMPLETED"}
              msg={`[UNICHAIN] 💸 SETTLEMENT COMPLETE. Transaction verified on-chain.`}
              highlight
            />
          </div>
        </div>

        {/* 4. Video Showcase Placeholder */}
        <div className="space-y-3 md:space-y-4 pt-6 md:pt-8">
          <h2 className="text-lg md:text-xl font-bold text-red-500 uppercase tracking-widest">
            Live Execution Demo
          </h2>
          <div className="w-full aspect-video bg-black border border-neutral-800 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)] group cursor-pointer hover:border-red-900/50 transition-colors rounded-sm">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center z-20 group-hover:bg-red-600/40 transition-colors backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-red-100 border-b-[6px] border-b-transparent ml-1 md:border-t-[8px] md:border-l-[12px] md:border-b-[8px]"></div>
            </div>
            <span className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-neutral-600 text-[10px] md:text-xs tracking-widest">
              relay_demo.mp4
            </span>
          </div>
        </div>

        {/* 5. Explanation Section with Flowchart */}
        <div className="space-y-3 md:space-y-4 pb-8">
          <h2 className="text-lg md:text-xl font-bold text-red-500 uppercase tracking-widest border-b border-red-900/30 pb-2">
            Protocol Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-xs md:text-sm text-neutral-400 leading-relaxed">
            <div className="bg-[#0a0a0a] p-4 border border-neutral-900 rounded-sm">
              <strong className="text-red-300 block mb-2 text-sm">
                1. Intent Broadcast
              </strong>
              Local agents lock native ETH into our Unichain Escrow contract via
              KeeperHub. The task intent is serialized and broadcast over the
              Gensyn AXL P2P network.
            </div>
            <div className="bg-[#0a0a0a] p-4 border border-neutral-900 rounded-sm">
              <strong className="text-red-300 block mb-2 text-sm">
                2. Autonomous Execution
              </strong>
              A specialized Worker agent picks up the task from the mesh,
              executes the computation, and uploads the deterministic JSON
              payload directly to the 0G Data layer.
            </div>
            <div className="bg-[#0a0a0a] p-4 border border-neutral-900 rounded-sm">
              <strong className="text-red-300 block mb-2 text-sm">
                3. Trustless Settlement
              </strong>
              Upon generating the cryptographic receipt on 0G, KeeperHub
              verifies the execution and triggers the Unichain contract to
              instantly release the locked funds.
            </div>
          </div>

          {/* THE FIX: Replaced the dark box placeholder with your actual flowchart.png */}
          <div className="w-full mt-4 md:mt-6 rounded-sm overflow-hidden border border-neutral-800 bg-black/50 group">
            <img
              src="/flowchart.png"
              alt="System Architecture Diagram"
              className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// UI Helper Components
function StatusCard({
  title,
  active,
  done,
  value,
  link,
}: {
  title: string;
  active: boolean;
  done: boolean;
  value: string;
  link?: string;
}) {
  return (
    <div
      className={`p-3 md:p-4 border transition-all duration-300 ${active ? "border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]" : done ? "border-red-900/30 bg-black" : "border-neutral-900 bg-black/50 text-neutral-700"}`}
    >
      <h3 className="text-[10px] md:text-xs font-bold mb-2 md:mb-3 flex items-center justify-between text-neutral-400">
        {title}
        {active && (
          <span className="animate-pulse w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 shadow-[0_0_8px_rgba(220,38,38,1)]"></span>
        )}
        {done && <span className="text-red-500 text-xs md:text-sm">✓</span>}
      </h3>
      <div className="text-[10px] md:text-xs truncate overflow-hidden bg-[#050505] p-2 border border-neutral-800 rounded-sm">
        {value !== "-" && link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-red-400 hover:text-white hover:underline flex items-center justify-between gap-2 transition-colors"
          >
            <span className="truncate">{value}</span>
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          <span className="text-neutral-600">
            {value === "-" ? "AWAITING..." : value}
          </span>
        )}
      </div>
    </div>
  );
}

function LogLine({
  show,
  msg,
  highlight = false,
}: {
  show: boolean;
  msg: string;
  highlight?: boolean;
}) {
  if (!show) return null;
  return (
    <div
      className={`animate-fade-in flex items-start ${highlight ? "text-red-400 font-bold" : "text-neutral-400"}`}
    >
      <span className="mr-2 md:mr-3 opacity-40">{`>`}</span>
      <span className="flex-1 leading-snug">{msg}</span>
    </div>
  );
}

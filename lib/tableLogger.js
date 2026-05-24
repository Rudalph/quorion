import Table from "cli-table3";

function truncate(val, front = 6, back = 6) {
  if (typeof val !== "string") val = JSON.stringify(val) ?? String(val);
  if (val.length <= front + back + 3) return val;
  return `${val.slice(0, front)}...${val.slice(-back)}`;
}

export function logSummaryTable({ walletAddress, message, algos, signatures, verificationResults, totalMs }) {
  const allVerified = verificationResults
    ? Object.values(verificationResults).every(r => r.status === "Valid")
      ? "✔ Valid"
      : "✘ Invalid"
    : "—";

  // Header block
  console.log("\n╔══════════════════════════════════════════════════════════════════╗");
  console.log(  "║              🔐  QUANTUM SIGNING REQUEST SUMMARY                ║");
  console.log(  "╚══════════════════════════════════════════════════════════════════╝");
  console.log(`  Wallet  : ${truncate(walletAddress, 10, 10)}`);
  console.log(`  Message : ${truncate(message, 10, 10)}`);
  console.log(`  Result  : ${allVerified}   ⏱  ${totalMs}ms`);
  console.log("");

  // Per-algo table
  const t = new Table({
    head: ["#", "Algorithm", "Signature", "Status"],
    colWidths: [4, 26, 28, 12],
    style: { head: ["cyan", "bold"] },
  });

  algos.forEach((algo, i) => {
    const sig = signatures?.[algo] ? truncate(signatures[algo], 8, 8) : "—";
    const verified = verificationResults?.[algo]?.status === "Valid" ? "✔ Valid" : "✘ Fail";
    t.push([i + 1, algo, sig, verified]);
  });

  console.log(t.toString());
  console.log("══════════════════════════════════════════════════════════════════════\n");
}

export function logSigningError(algo, errMessage) {
  const t = new Table({
    head: ["Algorithm", "Error", "Status"],
    colWidths: [24, 40, 12],
    style: { head: ["red"] },
  });
  t.push([algo, errMessage, "✘ FAILED"]);
  console.log("\n[ERROR] Signing failed");
  console.log(t.toString());
}
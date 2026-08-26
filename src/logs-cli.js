const { getReceipt } = require("./receipt");
const { inspectLogs, short } = require("./logs");

const txHash = process.argv[2];

if (!txHash) {
  console.log("");
  console.log("Base Mainnet Event Log Inspector");
  console.log("");
  console.log("Usage:");
  console.log("node src/logs-cli.js 0xTRANSACTION_HASH");
  console.log("");
  process.exit(1);
}

async function main() {
  const receipt = await getReceipt(txHash);

  if (!receipt) {
    console.log("Transaction belum memiliki receipt.");
    return;
  }

  const logs = inspectLogs(receipt);

  console.log("");
  console.log("=== BASE MAINNET EVENT LOGS ===");
  console.log("");
  console.log("Transaction :", txHash);
  console.log("Block       :", parseInt(receipt.blockNumber, 16));
  console.log("Log count   :", logs.length);
  console.log("");

  if (logs.length === 0) {
    console.log("Tidak ada event log.");
    return;
  }

  logs.forEach(log => {
    console.log(`--- Log #${log.index} ---`);
    console.log("Contract :", log.address);
    console.log("Topics   :", log.topics.length);

    log.topics.forEach((topic, i) => {
      console.log(`  Topic ${i}: ${short(topic, 70)}`);
    });

    console.log("Data     :", short(log.data, 70));
    console.log("");
  });

  console.log("Read-only: tidak ada transaksi dikirim.");
}

main().catch(error => {
  console.error("");
  console.error("ERROR:", error.message);
  process.exit(1);
});

const {
  getLatestBlock,
  inspectBlock
} = require("./block");

async function main() {
  console.log("");
  console.log("=== BASE MAINNET BLOCK INSPECTOR ===");
  console.log("");

  const raw = await getLatestBlock();
  const block = inspectBlock(raw);

  console.log("Block number :", block.number);
  console.log("Block hash   :", block.hash);
  console.log("Parent hash  :", block.parentHash);
  console.log("Timestamp    :", block.timestamp);
  console.log("Transactions :", block.transactionCount);

  const now = Math.floor(Date.now() / 1000);
  const age = now - block.timestamp;

  console.log("Block age    :", age, "seconds");

  if (age < 0) {
    console.log("Timestamp    : WARNING - future timestamp");
  } else if (age > 600) {
    console.log("Timestamp    : WARNING - block lebih dari 10 menit");
  } else {
    console.log("Timestamp    : OK");
  }

  console.log("");
  console.log("Read-only: tidak ada transaksi dikirim.");
}

main().catch(error => {
  console.error("");
  console.error("ERROR:", error.message);
  process.exit(1);
});

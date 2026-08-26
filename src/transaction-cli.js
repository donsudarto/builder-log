const {
  getTransaction,
  inspectTransaction
} = require("./transaction");

const hash = process.argv[2];

if (!hash) {
  console.log("");
  console.log("Base Mainnet Transaction Inspector");
  console.log("");
  console.log("Usage:");
  console.log("node src/transaction-cli.js 0xTRANSACTION_HASH");
  console.log("");
  process.exit(1);
}

async function main() {
  const tx = await getTransaction(hash);
  const result = inspectTransaction(tx);

  console.log("");
  console.log("=== BASE MAINNET TRANSACTION ===");
  console.log("");

  if (!result.found) {
    console.log(result.message);
    return;
  }

  console.log("Hash          :", result.hash);
  console.log("From          :", result.from);
  console.log("To            :", result.to || "(contract creation)");
  console.log("Value (wei)   :", result.valueWei);
  console.log("Nonce         :", result.nonce);
  console.log("Block         :", result.blockNumber ?? "pending");
  console.log("Gas limit     :", result.gas);
  console.log("Gas price     :", result.gasPriceWei);
  console.log("Input bytes   :", result.inputBytes);
  console.log("Tx type       :", result.type);

  console.log("");
  console.log("Read-only: tidak ada transaksi dikirim.");
}

main().catch(error => {
  console.error("");
  console.error("ERROR:", error.message);
  process.exit(1);
});

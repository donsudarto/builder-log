const {
  getReceipt,
  inspectReceipt
} = require("./receipt");

const txHash = process.argv[2];

if (!txHash) {
  console.log("");
  console.log("Base Mainnet Transaction Receipt Inspector");
  console.log("");
  console.log("Usage:");
  console.log("node src/receipt-cli.js 0xTRANSACTION_HASH");
  console.log("");
  process.exit(1);
}

async function main() {
  const receipt = await getReceipt(txHash);
  const result = inspectReceipt(receipt);

  console.log("");
  console.log("=== BASE MAINNET RECEIPT ===");
  console.log("");

  if (!result.found) {
    console.log(result.message);
    return;
  }

  console.log("Transaction :", result.transactionHash);
  console.log("Status      :", result.status);
  console.log("Block       :", result.blockNumber);
  console.log("Block hash  :", result.blockHash);
  console.log("Gas used    :", result.gasUsed);
  console.log("Cumulative  :", result.cumulativeGasUsed);
  console.log("Logs        :", result.logs);

  if (result.contractAddress) {
    console.log("Contract    :", result.contractAddress);
  }

  console.log("");
  console.log("Read-only: tidak ada transaksi dikirim.");
}

main().catch(error => {
  console.error("");
  console.error("ERROR:", error.message);
  process.exit(1);
});

const { analyzeAddress } = require("./wallet");

const address = process.argv[2];

if (!address) {
  console.log("Usage: node src/analyze.js 0xADDRESS");
  process.exit(1);
}

analyzeAddress(address)
  .then(result => {
    console.log("");
    console.log("=== BASE MAINNET WALLET ANALYZER ===");
    console.log("");
    console.log("Address :", result.address);
    console.log("Type    :", result.type);
    console.log("ETH     :", result.balanceETH);
    console.log("Nonce   :", result.nonce);
    console.log("Contract:", result.contract);
    console.log("");
  })
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });

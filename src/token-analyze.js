const { tokenInfo } = require("./token");

const token = process.argv[2];
const wallet =
  process.argv[3] ||
  "0x027Ff9cF1022CB2f64f350A382bE21426b991F16";

if (!token) {
  console.log("");
  console.log("Base ERC-20 Token Analyzer");
  console.log("");
  console.log("Usage:");
  console.log("node src/token-analyze.js TOKEN_ADDRESS [WALLET_ADDRESS]");
  console.log("");
  process.exit(1);
}

tokenInfo(token, wallet)
  .then(info => {
    console.log("");
    console.log("=== BASE ERC-20 ANALYZER ===");
    console.log("");
    console.log("Token    :", info.token);
    console.log("Name     :", info.name || "(unknown)");
    console.log("Symbol   :", info.symbol || "(unknown)");
    console.log("Decimals :", info.decimals);
    console.log("Wallet   :", info.wallet);
    console.log("Raw bal. :", info.balanceRaw);
    console.log("");
    console.log("Read-only RPC query completed.");
    console.log("");
  })
  .catch(err => {
    console.error("");
    console.error("Error:", err.message);
    process.exit(1);
  });

const {
  RPC_URL,
  BASE_CHAIN_ID,
  getChainId,
  getBlockNumber
} = require("./rpc");

async function main() {
  console.log("Base Mainnet RPC");
  console.log("-----------------");
  console.log("RPC:", RPC_URL);

  const chainId = await getChainId();
  const block = await getBlockNumber();

  console.log("Chain ID:", chainId);
  console.log("Expected:", BASE_CHAIN_ID);
  console.log("Latest block:", block);

  if (chainId !== BASE_CHAIN_ID) {
    throw new Error("RPC is not Base Mainnet");
  }

  console.log("Network verification: OK");
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

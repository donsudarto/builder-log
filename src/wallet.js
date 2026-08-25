const { rpc, getBalance } = require("./rpc");

function validateAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function weiToEth(wei) {
  const whole = wei / 1000000000000000000n;
  const fraction = wei % 1000000000000000000n;
  return `${whole}.${fraction.toString().padStart(18, "0")}`;
}

async function getNonce(address) {
  const result = await rpc("eth_getTransactionCount", [
    address,
    "latest"
  ]);
  return parseInt(result, 16);
}

async function getCode(address) {
  return rpc("eth_getCode", [address, "latest"]);
}

async function analyzeAddress(address) {
  if (!validateAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const [balance, nonce, code] = await Promise.all([
    getBalance(address),
    getNonce(address),
    getCode(address)
  ]);

  return {
    address,
    balanceWei: balance.toString(),
    balanceETH: weiToEth(balance),
    nonce,
    type: code === "0x" ? "EOA" : "Smart Contract",
    contract: code !== "0x"
  };
}

module.exports = {
  validateAddress,
  weiToEth,
  getNonce,
  getCode,
  analyzeAddress
};

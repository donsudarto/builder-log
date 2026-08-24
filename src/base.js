const BASE_MAINNET = {
  name: "Base Mainnet",
  chainId: 8453,
  currency: "ETH"
};

function isBaseMainnet(chainId) {
  return Number(chainId) === BASE_MAINNET.chainId;
}

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function weiToEth(wei) {
  return Number(wei) / 1e18;
}

function formatTransaction(tx) {
  return {
    hash: tx.hash ?? null,
    from: tx.from ?? null,
    to: tx.to ?? null,
    value: tx.value ?? null,
    status: tx.status ?? "unknown"
  };
}

module.exports = {
  BASE_MAINNET,
  isBaseMainnet,
  isAddress,
  weiToEth,
  formatTransaction
};

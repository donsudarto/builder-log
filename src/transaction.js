const { rpc } = require("./rpc");

function hexToNumber(value) {
  return value ? parseInt(value, 16) : 0;
}

function hexToBigInt(value) {
  return value ? BigInt(value) : 0n;
}

function validateHash(hash) {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

async function getTransaction(hash) {
  if (!validateHash(hash)) {
    throw new Error("Invalid transaction hash");
  }

  return rpc("eth_getTransactionByHash", [hash]);
}

function inspectTransaction(tx) {
  if (!tx) {
    return {
      found: false,
      message: "Transaction tidak ditemukan."
    };
  }

  return {
    found: true,
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    valueWei: hexToBigInt(tx.value).toString(),
    nonce: hexToNumber(tx.nonce),
    blockNumber: tx.blockNumber
      ? hexToNumber(tx.blockNumber)
      : null,
    gas: hexToNumber(tx.gas),
    gasPriceWei: hexToBigInt(tx.gasPrice).toString(),
    inputBytes: tx.input
      ? Math.max(0, (tx.input.length - 2) / 2)
      : 0,
    type: tx.type ? hexToNumber(tx.type) : 0
  };
}

module.exports = {
  getTransaction,
  inspectTransaction,
  validateHash,
  hexToNumber,
  hexToBigInt
};

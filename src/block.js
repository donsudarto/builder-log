const { rpc } = require("./rpc");

async function getLatestBlock() {
  return rpc("eth_getBlockByNumber", ["latest", false]);
}

function hexToNumber(value) {
  if (!value) return 0;
  return parseInt(value, 16);
}

function inspectBlock(block) {
  if (!block) {
    throw new Error("Block tidak tersedia");
  }

  return {
    number: hexToNumber(block.number),
    hash: block.hash,
    parentHash: block.parentHash,
    timestamp: hexToNumber(block.timestamp),
    transactionCount: Array.isArray(block.transactions)
      ? block.transactions.length
      : 0
  };
}

module.exports = {
  getLatestBlock,
  inspectBlock,
  hexToNumber
};

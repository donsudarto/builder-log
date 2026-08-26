const { rpc } = require("./rpc");

function hexToNumber(value) {
  return value ? parseInt(value, 16) : 0;
}

async function getReceipt(txHash) {
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error("Invalid transaction hash");
  }

  return rpc("eth_getTransactionReceipt", [txHash]);
}

function inspectReceipt(receipt) {
  if (!receipt) {
    return {
      found: false,
      message: "Transaction belum memiliki receipt atau hash tidak ditemukan."
    };
  }

  return {
    found: true,
    transactionHash: receipt.transactionHash,
    blockNumber: hexToNumber(receipt.blockNumber),
    blockHash: receipt.blockHash,
    status: receipt.status === "0x1" ? "SUCCESS" : "REVERTED",
    gasUsed: hexToNumber(receipt.gasUsed),
    cumulativeGasUsed: hexToNumber(receipt.cumulativeGasUsed),
    logs: Array.isArray(receipt.logs) ? receipt.logs.length : 0,
    contractAddress: receipt.contractAddress || null
  };
}

module.exports = {
  getReceipt,
  inspectReceipt,
  hexToNumber
};

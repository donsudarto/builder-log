const { getReceipt } = require("./receipt");

function inspectLogs(receipt) {
  if (!receipt) {
    return [];
  }

  return (receipt.logs || []).map((log, index) => ({
    index,
    address: log.address,
    topics: log.topics || [],
    data: log.data || "0x"
  }));
}

function short(value, length = 18) {
  if (!value) return "";
  if (value.length <= length) return value;
  return value.slice(0, length) + "...";
}

module.exports = {
  inspectLogs,
  short
};

function summarizeTransaction(tx) {
  return {
    hash: tx.hash ?? null,
    from: tx.from ?? null,
    to: tx.to ?? null,
    status: tx.status ?? "unknown"
  };
}

module.exports = { summarizeTransaction };

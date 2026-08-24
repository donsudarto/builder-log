function formatTransaction(tx) {
  return {
    hash: tx.hash || null,
    from: tx.from || null,
    to: tx.to || null,
  };
}

module.exports = { formatTransaction };

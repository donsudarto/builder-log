const assert = require("assert");
const { summarizeTransaction } = require("../src/transaction");

const result = summarizeTransaction({
  hash: "0x123",
  from: "0xabc",
  to: "0xdef",
  status: "success"
});

assert.strictEqual(result.hash, "0x123");
assert.strictEqual(result.status, "success");

console.log("Tests passed.");

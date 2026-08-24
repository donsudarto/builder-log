const assert = require("assert");
const { formatTransaction } = require("../src/example");

const result = formatTransaction({
  hash: "0x123",
  from: "0xabc",
  to: "0xdef",
});

assert.strictEqual(result.hash, "0x123");
assert.strictEqual(result.from, "0xabc");
assert.strictEqual(result.to, "0xdef");

console.log("All tests passed.");

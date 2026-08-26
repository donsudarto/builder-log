const assert = require("assert");

const {
  inspectTransaction,
  validateHash,
  hexToNumber,
  hexToBigInt
} = require("../src/transaction");

assert.strictEqual(hexToNumber("0x10"), 16);
assert.strictEqual(hexToBigInt("0xde0b6b3a7640000"), 1000000000000000000n);

assert.strictEqual(
  validateHash(
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ),
  true
);

assert.strictEqual(validateHash("0x123"), false);

const result = inspectTransaction({
  hash: "0xabc",
  from: "0x111",
  to: "0x222",
  value: "0xde0b6b3a7640000",
  nonce: "0x5",
  blockNumber: "0x100",
  gas: "0x5208",
  gasPrice: "0x1",
  input: "0x123456",
  type: "0x2"
});

assert.strictEqual(result.found, true);
assert.strictEqual(result.valueWei, "1000000000000000000");
assert.strictEqual(result.nonce, 5);
assert.strictEqual(result.blockNumber, 256);
assert.strictEqual(result.inputBytes, 3);
assert.strictEqual(result.type, 2);

console.log("Transaction utility tests passed.");

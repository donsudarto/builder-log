const assert = require("assert");

const {
  BASE_MAINNET,
  isBaseMainnet,
  isAddress,
  weiToEth,
  formatTransaction
} = require("../src/base");

assert.strictEqual(BASE_MAINNET.chainId, 8453);
assert.strictEqual(isBaseMainnet(8453), true);
assert.strictEqual(isBaseMainnet(1), false);

assert.strictEqual(
  isAddress("0x0000000000000000000000000000000000000000"),
  true
);

assert.strictEqual(
  isAddress("0x123"),
  false
);

assert.strictEqual(
  weiToEth("1000000000000000000"),
  1
);

const tx = formatTransaction({
  hash: "0x123",
  from: "0xabc",
  to: "0xdef",
  status: "success"
});

assert.strictEqual(tx.hash, "0x123");
assert.strictEqual(tx.status, "success");

console.log("Base toolkit tests passed.");

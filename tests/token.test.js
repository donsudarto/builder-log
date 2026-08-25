const assert = require("assert");
const {
  encodeAddress,
  decodeString
} = require("../src/token");

const address =
  "0x0000000000000000000000000000000000000000";

assert.strictEqual(
  encodeAddress(address).length,
  64
);

assert.strictEqual(
  decodeString("0x"),
  ""
);

console.log("Token utility tests passed.");

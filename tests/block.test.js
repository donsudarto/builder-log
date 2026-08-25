const assert = require("assert");
const { hexToNumber } = require("../src/block");

assert.strictEqual(hexToNumber("0x1"), 1);
assert.strictEqual(hexToNumber("0xa"), 10);
assert.strictEqual(hexToNumber("0x64"), 100);

console.log("Block utility tests passed.");

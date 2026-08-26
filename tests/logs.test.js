const assert = require("assert");
const { inspectLogs } = require("../src/logs");

const logs = inspectLogs({
  logs: [
    {
      address: "0x0000000000000000000000000000000000000001",
      topics: ["0x1234"],
      data: "0xabcd"
    }
  ]
});

assert.strictEqual(logs.length, 1);
assert.strictEqual(logs[0].index, 0);
assert.strictEqual(logs[0].topics.length, 1);

console.log("Event log tests passed.");

const assert = require("assert");
const {
  BASE_CHAIN_ID,
  getChainId,
  getBlockNumber
} = require("../src/rpc");

async function test() {
  const chainId = await getChainId();
  const block = await getBlockNumber();

  assert.strictEqual(chainId, BASE_CHAIN_ID);
  assert.ok(Number.isInteger(block));
  assert.ok(block > 0);

  console.log("Base RPC tests passed.");
  console.log("Chain ID:", chainId);
  console.log("Latest block:", block);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

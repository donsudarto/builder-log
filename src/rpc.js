const https = require("https");

const RPC_URL = "https://mainnet.base.org";
const BASE_CHAIN_ID = 8453;

function rpc(method, params = []) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params
    });

    const req = https.request(
      RPC_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      res => {
        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);

            if (json.error) {
              reject(new Error(json.error.message));
              return;
            }

            resolve(json.result);
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function getChainId() {
  const result = await rpc("eth_chainId");
  return parseInt(result, 16);
}

async function getBlockNumber() {
  const result = await rpc("eth_blockNumber");
  return parseInt(result, 16);
}

async function getBalance(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const result = await rpc("eth_getBalance", [address, "latest"]);
  return BigInt(result);
}

module.exports = {
  RPC_URL,
  BASE_CHAIN_ID,
  rpc,
  getChainId,
  getBlockNumber,
  getBalance
};

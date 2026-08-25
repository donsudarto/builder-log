const { rpc } = require("./rpc");

const SELECTOR = {
  balanceOf: "0x70a08231",
  decimals: "0x313ce567",
  symbol: "0x95d89b41",
  name: "0x06fdde03",
  totalSupply: "0x18160ddd"
};

function encodeAddress(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid address");
  }

  return address.slice(2).padStart(64, "0");
}

function decodeString(hex) {
  if (!hex || hex === "0x") return "";

  try {
    const data = hex.slice(2);

    if (data.length < 128) {
      return Buffer.from(data, "hex").toString("utf8").replace(/\0/g, "");
    }

    const offset = parseInt(data.slice(0, 64), 16);
    const length = parseInt(data.slice(offset * 2, offset * 2 + 64), 16);
    const start = offset * 2 + 64;

    return Buffer.from(
      data.slice(start, start + length * 2),
      "hex"
    ).toString("utf8");
  } catch {
    return "";
  }
}

async function call(contract, data) {
  return rpc("eth_call", [
    {
      to: contract,
      data
    },
    "latest"
  ]);
}

async function tokenInfo(token, wallet) {
  const balance = await call(
    token,
    SELECTOR.balanceOf + encodeAddress(wallet)
  );

  const decimals = await call(token, SELECTOR.decimals);
  const symbol = await call(token, SELECTOR.symbol);
  const name = await call(token, SELECTOR.name);

  return {
    token,
    wallet,
    name: decodeString(name),
    symbol: decodeString(symbol),
    decimals: parseInt(decimals, 16),
    balanceRaw: BigInt(balance).toString()
  };
}

module.exports = {
  tokenInfo,
  encodeAddress,
  decodeString
};

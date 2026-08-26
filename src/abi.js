'use strict';

const HEX_RE = /^0x[0-9a-fA-F]*$/;
const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

function assertHex(value, name = 'value') {
  if (typeof value !== 'string' || !HEX_RE.test(value) || value.length % 2 !== 0) {
    throw new TypeError(`${name} must be an even-length hex string`);
  }
}

function strip0x(value) {
  return value.startsWith('0x') ? value.slice(2) : value;
}

function normalizeHex(value) {
  assertHex(value);
  return `0x${strip0x(value).toLowerCase()}`;
}

function readWord(data, index) {
  const hex = strip0x(data);
  const start = index * 64;
  const word = hex.slice(start, start + 64);

  if (word.length !== 64) {
    throw new RangeError(`ABI word ${index} is out of bounds`);
  }

  return word;
}

function wordToBigInt(word) {
  return BigInt(`0x${word}`);
}

function decodeUint256(word) {
  return wordToBigInt(word);
}

function decodeInt256(word) {
  const value = wordToBigInt(word);
  const max = 1n << 255n;

  return value >= max ? value - (1n << 256n) : value;
}

function decodeAddress(word) {
  return `0x${word.slice(24)}`;
}

function decodeBool(word) {
  const value = wordToBigInt(word);

  if (value !== 0n && value !== 1n) {
    throw new Error('Invalid ABI bool value');
  }

  return value === 1n;
}

function decodeBytes32(word) {
  return `0x${word}`;
}

function decodeDynamicBytes(data, byteOffset) {
  const hex = strip0x(data);
  const offset = Number(byteOffset);

  if (!Number.isSafeInteger(offset) || offset < 0 || offset * 2 > hex.length) {
    throw new RangeError('Invalid ABI dynamic offset');
  }

  const lengthWord = hex.slice(offset * 2, offset * 2 + 64);

  if (lengthWord.length !== 64) {
    throw new RangeError('Missing ABI dynamic length');
  }

  const length = Number(wordToBigInt(lengthWord));

  if (!Number.isSafeInteger(length)) {
    throw new RangeError('ABI dynamic value is too large');
  }

  const start = offset * 2 + 64;
  const end = start + length * 2;
  const value = hex.slice(start, end);

  if (value.length !== length * 2) {
    throw new RangeError('ABI dynamic value is truncated');
  }

  return `0x${value}`;
}

function decodeString(data, byteOffset) {
  const bytes = decodeDynamicBytes(data, byteOffset);

  return Buffer.from(strip0x(bytes), 'hex').toString('utf8');
}

function isDynamicType(type) {
  return (
    type === 'string' ||
    type === 'bytes' ||
    type.endsWith('[]') ||
    /\[\d*\]$/.test(type) && type.includes('[]')
  );
}

function decodeStatic(type, word) {
  if (type === 'address') return decodeAddress(word);
  if (type === 'bool') return decodeBool(word);
  if (type === 'uint256' || /^uint\d+$/.test(type)) {
    return decodeUint256(word);
  }

  if (type === 'int256' || /^int\d+$/.test(type)) {
    return decodeInt256(word);
  }

  if (type === 'bytes32') return decodeBytes32(word);

  if (/^bytes\d+$/.test(type)) {
    const size = Number(type.slice(5));

    if (size < 1 || size > 32) {
      throw new Error(`Unsupported ABI type: ${type}`);
    }

    return `0x${word.slice(0, size * 2)}`;
  }

  throw new Error(`Unsupported static ABI type: ${type}`);
}

function decodeParameter(type, data, wordIndex = 0) {
  assertHex(data, 'data');

  const word = readWord(data, wordIndex);

  if (type === 'string') {
    return decodeString(data, Number(wordToBigInt(word)));
  }

  if (type === 'bytes') {
    return decodeDynamicBytes(data, Number(wordToBigInt(word)));
  }

  if (isDynamicType(type)) {
    throw new Error(`Dynamic ABI type not implemented: ${type}`);
  }

  return decodeStatic(type, word);
}

function decodeParameters(types, data) {
  assertHex(data, 'data');

  return types.map((type, index) => decodeParameter(type, data, index));
}

function decodeEventLog(eventAbi, topics, data = '0x') {
  if (!eventAbi || eventAbi.type !== 'event') {
    throw new TypeError('eventAbi must be an ABI event definition');
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    throw new TypeError('topics must be a non-empty array');
  }

  assertHex(data, 'data');

  const indexed = eventAbi.inputs.filter(input => input.indexed);
  const nonIndexed = eventAbi.inputs.filter(input => !input.indexed);

  let topicIndex = eventAbi.anonymous ? 0 : 1;
  let dataIndex = 0;

  const args = {};

  for (const input of eventAbi.inputs) {
    if (input.indexed) {
      if (topicIndex >= topics.length) {
        throw new RangeError(`Missing topic for ${input.name || input.type}`);
      }

      const topic = normalizeHex(topics[topicIndex++]);

      if (isDynamicType(input.type)) {
        // Indexed dynamic parameters are represented by their Keccak hash.
        args[input.name] = topic;
      } else {
        args[input.name] = decodeStatic(input.type, strip0x(topic));
      }
    } else {
      args[input.name] = decodeParameter(input.type, data, dataIndex++);
    }
  }

  return {
    event: eventAbi.name,
    anonymous: Boolean(eventAbi.anonymous),
    indexedCount: indexed.length,
    nonIndexedCount: nonIndexed.length,
    args
  };
}

const ERC20_TRANSFER_EVENT = {
  type: 'event',
  name: 'Transfer',
  anonymous: false,
  inputs: [
    {
      indexed: true,
      name: 'from',
      type: 'address'
    },
    {
      indexed: true,
      name: 'to',
      type: 'address'
    },
    {
      indexed: false,
      name: 'value',
      type: 'uint256'
    }
  ]
};

module.exports = {
  ERC20_TRANSFER_EVENT,
  assertHex,
  normalizeHex,
  decodeUint256,
  decodeInt256,
  decodeAddress,
  decodeBool,
  decodeBytes32,
  decodeDynamicBytes,
  decodeString,
  decodeParameter,
  decodeParameters,
  decodeEventLog
};

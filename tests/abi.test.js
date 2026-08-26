'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ERC20_TRANSFER_EVENT,
  decodeParameter,
  decodeParameters,
  decodeEventLog,
  decodeAddress
} = require('../src/abi');

const ADDRESS_A =
  '0000000000000000000000001111111111111111111111111111111111111111';

const ADDRESS_B =
  '0000000000000000000000002222222222222222222222222222222222222222';

test('decodes uint256', () => {
  const value = decodeParameter(
    'uint256',
    `0x${'0'.repeat(63)}7`
  );

  assert.equal(value, 7n);
});

test('decodes address', () => {
  const value = decodeAddress(ADDRESS_A);

  assert.equal(
    value,
    '0x1111111111111111111111111111111111111111'
  );
});

test('decodes bool', () => {
  assert.equal(
    decodeParameter('bool', `0x${'0'.repeat(63)}1`),
    true
  );
});

test('decodes bytes32', () => {
  const word = 'ab'.repeat(32);

  assert.equal(
    decodeParameter('bytes32', `0x${word}`),
    `0x${word}`
  );
});

test('decodes multiple static parameters', () => {
  const data =
    '0x' +
    '0'.repeat(63) + '2' +
    ADDRESS_A +
    '0'.repeat(63) + '1';

  const values = decodeParameters(
    ['uint256', 'address', 'bool'],
    data
  );

  assert.equal(values[0], 2n);
  assert.equal(values[1], '0x1111111111111111111111111111111111111111');
  assert.equal(values[2], true);
});

test('decodes dynamic string', () => {
  const text = Buffer.from('hello', 'utf8').toString('hex');

  const data =
    '0x' +
    '0'.repeat(63) + '20' +
    '0'.repeat(63) + '5' +
    text.padEnd(64, '0');

  assert.equal(
    decodeParameter('string', data),
    'hello'
  );
});

test('decodes ERC20 Transfer event', () => {
  const topics = [
    '0x' + '00'.repeat(32),
    '0x' + ADDRESS_A,
    '0x' + ADDRESS_B
  ];

  const data =
    '0x' +
    '0'.repeat(63) + '64';

  const result = decodeEventLog(
    ERC20_TRANSFER_EVENT,
    topics,
    data
  );

  assert.equal(result.event, 'Transfer');
  assert.equal(
    result.args.from,
    '0x1111111111111111111111111111111111111111'
  );
  assert.equal(
    result.args.to,
    '0x2222222222222222222222222222222222222222'
  );
  assert.equal(result.args.value, 100n);
});

test('rejects malformed hex', () => {
  assert.throws(
    () => decodeParameter('uint256', 'not-hex'),
    /hex string/
  );
});

# Base Mainnet Transaction Inspector

Read-only inspector untuk transaksi EVM.

Data yang diperiksa:

- transaction hash
- sender (`from`)
- recipient (`to`)
- value dalam wei
- nonce
- block number
- gas limit
- gas price
- ukuran input data
- transaction type

Tool ini tidak melakukan signing,
tidak membutuhkan private key,
dan tidak melakukan broadcast transaksi.

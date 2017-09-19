export const environment = {
  production: true,
  COIN_API_URL: 'https://api.coinmarketcap.com/v1/ticker',
  ETH_NODE_URL: 'https://kovan.infura.io/',
  // ETH_NODE_URL: 'https://mainnet.infura.io/',
  ETH_SCAN:'https://kovan.etherscan.io/',
  API_URL: 'http://blockaction.io/api',
  BITCOIN : {
    TRANSATIONS:     'https://testnet.blockexplorer.com/api/addrs/ADDRESS/txs',
    BALANCE_API:     'https://testnet.blockexplorer.com/api/addr/ADDRESS/balance',
    UTXO_API:        'https://testnet.blockexplorer.com/api/addr/ADDRESS/utxo',
    TRANSACTION_API: 'https://testnet.blockexplorer.com/api/tx/send'
  }
  // BITCOIN : {
  //   TRANSATIONS:     'https://blockexplorer.com/api/addrs/ADDRESS/txs',
  //   BALANCE_API:     'https://blockexplorer.com/api/addr/ADDRESS/balance',
  //   UTXO_API:        'https://blockexplorer.com/api/addr/ADDRESS/utxo',
  //   TRANSACTION_API: 'https://blockexplorer.com/api/tx/send'
  // }
};

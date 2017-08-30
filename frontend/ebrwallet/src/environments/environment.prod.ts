export const environment = {
  production: true,
  COIN_API_URL: 'https://api.coinmarketcap.com/v1/ticker',
  ETH_NODE_URL: 'https://mainnet.infura.io/',
  API_URL: 'http://web3c.etherworld.co:1234',
  BITCOIN : {
    TRANSATIONS:     'https://blockexplorer.com/api/addrs/ADDRESS/txs',
    BALANCE_API:     'https://blockexplorer.com/api/addr/ADDRESS/balance',
    UTXO_API:        'https://blockexplorer.com/api/addr/ADDRESS/utxo',
    TRANSACTION_API: 'https://blockexplorer.com/api/tx/send'
  }
};

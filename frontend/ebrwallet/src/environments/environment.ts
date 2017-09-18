// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  COIN_API_URL: 'https://api.coinmarketcap.com/v1/ticker',
  ETH_NODE_URL: 'https://kovan.infura.io/',
  ETH_SCAN:'https://kovan.etherscan.io/',
  API_URL: 'http://localhost:1234/api',
  BITCOIN : {
    TRANSATIONS:     'https://testnet.blockexplorer.com/api/addrs/ADDRESS/txs',
    BALANCE_API:     'https://testnet.blockexplorer.com/api/addr/ADDRESS/balance',
    UTXO_API:        'https://testnet.blockexplorer.com/api/addr/ADDRESS/utxo',
    TRANSACTION_API: 'https://testnet.blockexplorer.com/api/tx/send'
  }
};

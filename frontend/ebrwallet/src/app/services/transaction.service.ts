import { Injectable } from '@angular/core';

declare var EthJS : any
declare var Web3 : any

@Injectable()
export class TransactionService {

  web3: any
  url : string = 'http://localhost:8545'

  constructor() {

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));

  }

  // sendTransaction ... send transactions from an address to another address
  /*
   * sendTransaction(from : string, to : string, opts : object)
   *    - from : address from which transaction  is being made
   *    - to   : address to which transaction is being sent
   *    - opts : optional data to send (object)
   *             - transaction ID   (integer)
   *             - transaction data (string)
   *             - value / amount to send (number)
   *             - 
   */
  sendTransaction(from : string, to : string, opts : any) {
    var rawTx = {
      nonce: '00',
      gasPrice: '09184e72a000',
      gasLimit: '2710',
      from,
      to,
      value: opts.value || 0 ,
      data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
    };
    // var tx = new Transaction(rawTx);
  }


  // sendMoney ... send money in transaction
  /*
   * sendMoney(from : string, to : string, value: number, opts : object)
   *    - from : address from which transaction  is being made
   *    - to   : address to which transaction is being sent
   *    - value: amount of tokens to be send in transaction(default is "Wei")  
   *    - opts : optional data to send (object)
   *             - transaction ID   (integer data)
   *             - transaction data (string data)
   *             - 
  */
  sendMoney(from : string, to: string, value: number, opts: object) {

  }

  // getTransactionHistory ... get all transaction information involving the given address
  getTransactionHistory(address: string) {

  }

  // getTransacionDetails ... get the details of transaction from transaction hash  
  getTransactionDetails(transactionHash : string) {

  }


}

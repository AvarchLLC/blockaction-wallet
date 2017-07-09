import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Buffer } from 'buffer'
import  Transaction  from 'ethereumjs-tx'

declare var EthJS : any
declare var Web3 : any


@Injectable()
export class TransactionService {

  web3: any
  url : string = 'http://localhost:8545'

  constructor(private http: Http) {

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));

  }

  // createTransaction ... create transactions from an address to another address
  /*
   * createTransaction(from : string, to : string, opts : object)
   *    - from : address from which transaction is sent
   *    - to   : address to which transaction is sent
   *    - opts : optional data to send (object)
   *             - transaction data (string)
   *             - value / amount to send (number)
   *             - 
   */
  createTransaction(from: string, to : string, opts : any) : Transaction {
    let nonce = this.web3.eth.getTransactionCount(from)
    const nonceHex = this.web3.toHex(nonce);
  

    var rawTx = {
      gas: 4712388,
      gasPrice: 100000000000,
      nonce: nonceHex,
      // gasLimit: '2710',
      to,
      value: opts.value || 0 ,
      data: opts.data,
    };
    var tx = new Transaction()
    return tx;
  }

  // signTransaction ... signs transaction with a provate key
  signAndSerializeTransaction(tx : Transaction , privkey : string) : Promise<any> {
    return new Promise((resolve,reject) => {
      try {
        tx.sign(Buffer.from(privkey, 'hex'))
        resolve(tx.serialize().toString('hex'))
      }catch(e){
        reject('Error signing transaction. Private key is invalid.')
      }
    })
  }

  // sendTransaction ... send a serialized transaction to a ethereum node
  sendTransaction(serialTx: string) : Promise<any> {
    return new Promise((resolve,reject) => {
      try {
        this.web3.sendRawTransaction('0x' + serialTx)
        resolve(true)
      }catch(e){
        console.log(e)
        reject('Transaction failed.')
      }
    })
  }
  // getTransactionCost ... get the total cost for processing transaction
  getTransactionCost(tx: Transaction) : string {
    return tx.getUpfrontCost().toString(10)
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
  sendMoney(from : string, to: string, value: number, opts: object, privateKey: string) {
    return new Promise((resolve, reject) => {
      try{
        let tx = this.createTransaction(from,to,{ value: value})
        this.signAndSerializeTransaction(tx, privateKey )
            .then(serialTx => this.sendTransaction(serialTx).then(resolve).catch(reject))
            .catch(reject)
      }catch(e){
        reject(e)
      }
    })

  }

  // getTransactionHistory ... get all transaction information involving the given address
  getTransactionHistory(address: string) {

  }

  // getTransacionDetails ... get the details of transaction from transaction hash  
  getTransactionDetails(transactionHash : string) {

  }

  getPrice() : Promise<any> {
    return this.http
      .get('https://api.etherscan.io/api?module=stats&action=ethprice')
      .toPromise()
      .then(res => res.json())
      .then(res => res.result)
      /*
        Sample Response:
        {
          ethbtc: "0.09634",
          ethbtc_timestamp: "1499590928",
          ethusd: "244.27",
          ethusd_timestamp: "1499590943"
        }
      */
  }


}

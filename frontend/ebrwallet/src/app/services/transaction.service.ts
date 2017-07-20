import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Buffer } from 'buffer';
import Transaction from 'ethereumjs-tx';

declare var EthJS: any;
declare var Web3: any;


@Injectable()
export class TransactionService {

  web3: any;
  url = 'http://localhost:8545';

  constructor(private http: Http) {

    // this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
    this.web3 = new Web3();
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
  createTransaction(from: string, to: string, opts: any): Transaction {
    // const nonce = this.web3.eth.getTransactionCount(from);
    // const nonceHex = this.web3.toHex(nonce);

    const rawTx = {
      // nonce: nonceHex,
      to, // : '0xc787be952a82544713e31890e114569e67bf3e3b',
      value: 100,
      data: 'Payment'
    };
    //
    // rawTx['gas'] = this.web3.eth.estimateGas(rawTx);
    // rawTx['gasLimit'] = this.web3.eth.estimateGas(rawTx);

    const tx = new Transaction(rawTx);

    return tx;
  }

  // signTransaction ... signs transaction with a provate key
  signAndSerializeTransaction(tx: Transaction, privkey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        tx.sign(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(privkey), 'hex'));
        // tx.sign(Buffer.from('b7aa234e7fa851682e8e52755606b35d0cd37669e43dccb4f9e51311f780ea78','hex'))

        resolve(tx.serialize().toString('hex'));
      } catch (e) {
        reject('Error signing transaction. Private key is invalid.');
      }
    });
  }

  // sendTransaction ... send a serialized transaction to a ethereum node
  sendTransaction(serialTx: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // this.web3.eth.sendRawTransaction('0x' + serialTx);
        resolve(true);
      } catch (e) {
        console.log(e);
        reject('Transaction failed.');
      }
    });
  }
  // getTransactionCost ... get the total cost for processing transaction
  getTransactionCost(tx: Transaction): string {
    return tx.getUpfrontCost().toString(10);
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
  sendMoney(to: string, value: number, privateKey: string) {
    return new Promise((resolve, reject) => {
      try {
        const wei_value = this.web3.toWei(value, 'ether');
        const from = EthJS.Util.bufferToHex(EthJS.Util.privateToAddress(EthJS.Util.addHexPrefix(privateKey)));

        const tx = this.createTransaction(from, to, { value: value });

        this.signAndSerializeTransaction(tx, privateKey)
          .then(serialTx => this.sendTransaction(serialTx).then(resolve).catch(reject))
          .catch(reject);

      } catch (e) {
        reject(e);
      }
    });

  }

  // getTransactionDetails ... get the details of transaction from transaction hash
  getTransactionDetails(transactionHash: string) {
    return this.http
      .get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}`)
      .toPromise()
      .then(res => res.json());
  }

  // getAllTransactions ... get all transaction information involving the given address
  getAllTransactions(address: string): Promise<any> {
    return this.http
      .get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&tag=latest`)
      .toPromise()
      .then(res => res.json())
      .then(res=> res.result);
  }

  getPrice(): Promise<any> {
    return this.http
      .get('https://api.etherscan.io/api?module=stats&action=ethprice')
      .toPromise()
      .then(res => res.json())
      .then(res => res.result);
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

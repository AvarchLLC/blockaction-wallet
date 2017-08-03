import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Buffer } from 'buffer';
import Transaction from 'ethereumjs-tx';
import { ApiResponse } from './response';
import { TransactionResponse } from './transaction-response';

declare var EthJS: any;
declare var web3: any;

@Injectable()
export class TransactionService {

  NETWORK = 'ropsten';
  API_URL = `https://${this.NETWORK}.infura.io/`;
  serverUrl = '';

  constructor(private http: Http) { }

  /**
   * Call Infura Api
   * @param method Ethereum JSON-RPC method
   * @param params Parameters for JSON-RPC method
   */
  private callApi(method, params): Promise<any> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const body = {
      jsonrpc : '2.0',
      id: 1,
      method: method,
      params: params
    };

    return this.http
      .post(`${this.API_URL}`, body, { headers })
      .map((res) => res.json() as ApiResponse)
      .map((res) => {
        if (res.error) {
          throw new Error(res.error.message);
        } else {
          return res;
        }
      })
      .toPromise();
  }

  /**
   * createTransaction ... create transactions from an address to another address
   */
  createTransaction(from: string, to: string, opts: any): Promise<Transaction> {

    return this.callApi('eth_getTransactionCount', [from, 'latest'])
      .then(res => res.result)
      .then(nonce => {
        const rawTx = {
          from,
          nonce: nonce,
          to,
          value: opts.value,
          gasLimit: '0x27100'
        };
        const tx = new Transaction(rawTx);
        return tx;
      })
      .catch(err => Promise.reject({ message : 'Couldn\'t get transaction count.'}));
  }

  /**
   * signTransaction ... signs transaction with a private key
   */
  signAndSerializeTransaction(tx: Transaction, privkey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        tx.sign(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(privkey), 'hex'));
        // tx.sign(Buffer.from('b7aa234e7fa851682e8e52755606b35d0cd37669e43dccb4f9e51311f780ea78','hex'))

        resolve('0x' + tx.serialize().toString('hex'));
      } catch (e) {
        reject({ message : 'Error signing transaction. Private key is invalid.'});
      }
    });
  }

  /**
  * sendTransaction ... send a serialized transaction to a ethereum node
    */
  sendTransaction(serialTx: string): Promise<any> {

    return this.callApi('eth_sendRawTransaction', [serialTx])
      .then(res => {
        console.log(res);
        return res.result;
      });
  }

  /**
   * getTransactionCost ... get the total cost for processing transaction
    */
  getTransactionCost(tx: Transaction): Promise<number> {
    delete tx['gasLimit'];

    let gasUsed;

    return this.callApi('eth_estimateGas', [tx])
      .then(res => res.result)
      .then(gas => {
        gasUsed = web3.toDecimal(gas);
        return this.callApi('eth_gasPrice', ['latest']);
      })
      .then(res => res.result)
      .then(price => {
        const gasPrice = web3.toDecimal(web3.fromWei(web3.toDecimal(price), 'ether'));
        const totalCost = gasUsed * gasPrice;
        return totalCost;
      });
  }

  /**
   * sendMoney ... send money in transaction
  */
  sendMoney(from: string, to: string, value: number, privateKey: string): Promise<string> {
    const wei_value = web3.toWei(value, 'ether');
    const hexValue = web3.toHex(wei_value);

    return this.createTransaction(from, to, { value: hexValue })
      .then(tx => this.signAndSerializeTransaction(tx, privateKey))
      .then(serialTx => this.sendTransaction(serialTx));
  }

  /**
   * getTransactionDetails ... get the details of transaction from transaction hash
    */
  getTransactionDetails(transactionHash: string) {
    return this.callApi('eth_getTransactionByHash', [transactionHash])
      .then(res => res.result);
  }

  /**
   * getAllTransactions ... get all transaction information involving the given address
    */
  getAllTransactions(address: string): any {
    let network = this.NETWORK;
    if ( network === 'mainnet') { network = 'api'; }

    return this.http
    .get(`https://${network}.etherscan.io/api?module=account&action=txlist&address=${address}&tag=latest&sort=desc&startBlock=0&endBlock=latest`)
      .map(res => {
        const resp = res.json();
        return resp.result as TransactionResponse[];
      })
      .toPromise();
  }

  /**
   * Get the convertion rate for given symbol
   * @param type Symbol (eg. ethbtc, ethusd)
   */
  getConversionRate(type): Promise<any> {
    let symbol = type;
    if (!type) {
      symbol = 'ethusd';
    }

    return this.http
      .get(`https://api.infura.io/v1/ticker/${symbol}`)
      .map(res => res.json())
      .toPromise();
  }

  /**
   * Unofficial Api from EtherScan.io to check if transaction exists
   * @param txHash Transaction Hash
   */
  checkTransactionExists(txHash: string): Observable<boolean> {
    return this.http
      .get(`https://etherscan.io/api?module=localchk&action=txexist&txhash=${txHash}`)
      .map(res => res.json())
      .map(res => {
        if (res.result === 'True') {
          return true;
        } else {
          return false;
        }
      });
  }

  weiToEther(wei: string): string {
    return web3.fromWei(wei, 'ether');
  }

  etherToWei(ether: string): string {
    return web3.toWei(ether, 'ether');
  }

  intToHex(value: any): string {
    return web3.toHex(value);
  }

  /**
   * Get balance in given address
   * @param address Account Address
   */
  getBalance(address: string): Promise<any> {
    return this.callApi('eth_getBalance', [address, 'latest'])
      .then(res => res.result)
      .then(balanceHex => web3.fromWei(EthJS.Util.bufferToInt(balanceHex)));
  }

  /**
   * Request Ether by email
   * @param address address to receive
   * @param email email to request
   * @param value request amount in ether
   */
  requestEther(address: string, email: string, value: number): Promise<any> {
    return this.http
      .post(`${this.serverUrl}/api/requestEther`, { address, email, value })
      .toPromise()
      .then(res => res.json());
  }
}

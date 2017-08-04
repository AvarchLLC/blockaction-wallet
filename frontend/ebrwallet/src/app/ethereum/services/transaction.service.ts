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
declare var Web3: any;

@Injectable()
export class TransactionService {

  NETWORK = 'ropsten';
  API_URL = `https://${this.NETWORK}.infura.io/`;
  serverUrl = '';
  web3: any;

  constructor(private http: Http) { 
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.API_URL));  
  }

  /**
   * Call Infura Api
   * @param method Ethereum JSON-RPC method
   * @param params Parameters for JSON-RPC method
   */
  // private callApi(method, params): Promise<any> {

  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   headers.append('Accept', 'application/json');

  //   const body = {
  //     jsonrpc : '2.0',
  //     id: 1,
  //     method: method,
  //     params: params
  //   };

  //   return this.http
  //     .post(`${this.API_URL}`, body, { headers })
  //     .map((res) => {
  //       return res.json() as ApiResponse
  //     })
  //     .map((res) => {
  //       if (res.error) {
  //         throw new Error(res.error.message);
  //       } else {
  //         return res.result;
  //       }
  //     })
  //     .toPromise();
  // }

  /**
   * createTransaction ... create transactions from an address to another address
   */
  createTransaction(from: string, to: string, opts: any): Promise<Transaction> {
    return new Promise((resolve,reject) => {
      this.web3.eth.getTransactionCount(from, (err, number) => {
        if(err) reject(err);
        const rawTx = {
          from,
          nonce: this.web3.toHex(number),
          to,
          value: opts.value,
          gasLimit: '0x27100'
        };
        console.log('here', rawTx)
        const tx = new Transaction(rawTx);
        console.log('tx', tx)
        resolve(tx);
      })
    })
    // return this.callApi('eth_getTransactionCount', [from, 'latest'])
    //   .then(nonce => {
    //     const rawTx = {
    //       from,
    //       nonce: nonce,
    //       to,
    //       value: opts.value,
    //       gasLimit: '0x27100'
    //     };
    //     const tx = new Transaction(rawTx);
    //     return tx;
    //   })
    //   .catch(err => Promise.reject({ message : 'Couldn\'t get transaction count.'}));
  }

  /**
   * signTransaction ... signs transaction with a private key
   */
  signAndSerializeTransaction(tx: Transaction, privkey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        tx.sign(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(privkey), 'hex'));
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
    // return this.callApi('eth_sendRawTransaction', [serialTx]);
    return new Promise((resolve, reject) => {
      console.log('sereialtx', serialTx)
      this.web3.eth.sendRawTransaction(serialTx, (err, hash) => {
        if(err) reject(err);
        resolve(hash);
      })
    })
  }

  /**
   * getTransactionCost ... get the total cost for processing transaction
    */
  getTransactionCost(tx: Transaction): Promise<number> {
    return new Promise((resolve, reject) => {
      this.web3.eth.estimateGas(tx, (err, gas) => {
        if(err) reject(err);
        this.web3.eth.getGasPrice((err, price) => {
          if(err) reject(err);
          resolve(price.div(1e18).mul(gas).toString())
        })
      })
    })
    // let gasUsed;
    // return this.callApi('eth_estimateGas', [tx])
    //   .then(gas => {
    //     gasUsed = this.web3.toDecimal(gas);
    //     return this.callApi('eth_gasPrice', ['latest']);
    //   })
    //   .then(price => {
    //     const gasPrice = this.web3.toDecimal(this.web3.fromWei(this.web3.toDecimal(price), 'ether'));
    //     const totalCost = gasUsed * gasPrice;
    //     return totalCost;
    //   });
  }

  /**
   * sendMoney ... send money in transaction
  */
  sendMoney(from: string, to: string, value: number, privateKey: string): Promise<string> {
    const wei_value = this.web3.toWei(value, 'ether');
    const hexValue = this.web3.toHex(wei_value);
    from = EthJS.Util.addHexPrefix(from);
    to = EthJS.Util.addHexPrefix(to);

    return this.createTransaction(from, to, { value: hexValue })
      .then(tx => this.signAndSerializeTransaction(tx, privateKey))
      .then(serialTx => this.sendTransaction(serialTx));
  }

  /**
   * getTransactionDetails ... get the details of transaction from transaction hash
    */
  getTransactionDetails(transactionHash: string) {
    // return this.callApi('eth_getTransactionByHash', [transactionHash]);
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransaction(transactionHash, (err,txn) => {
        if(err) reject(err);
        resolve(txn);
      });
    });
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
    const ether = this.web3.fromWei(wei, 'ether');
    return ether;
  }

  etherToWei(ether: string): string {
    const wei = this.web3.toWei(ether, 'ether');
    return wei;
  }

  intToHex(value: any): string {
    return this.web3.toHex(value);
  }

  /**
   * Get balance in given address
   * @param address Account Address
   */
  getBalance(address: string): Promise<any> {
    // return this.callApi('eth_getBalance', [address, 'latest'])
    //   .then(balanceHex => this.web3.fromWei(EthJS.Util.bufferToInt(balanceHex)));
    return Promise.resolve(this.web3.eth.getBalance(address).toNumber());
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

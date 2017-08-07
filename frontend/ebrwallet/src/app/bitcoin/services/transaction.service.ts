import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';


import { TransactionResponse } from './transaction-response';

@Injectable()
export class TransactionService {

  constructor(private http: Http) {
  }
  /**
   * createTransaction ... create transactions from an address to another address
   */
  createTransaction(from: string, to: string, opts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true)
    });
  }

  /**
   * signTransaction ... signs transaction with a private key
   */
  signAndSerializeTransaction(tx: any, privkey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(true);
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
      resolve(true)
    });
  }

  /**
   * sendMoney ... send money in transaction
  */
  sendMoney(from: string, to: string, value: number, gasPrice: string, privateKey: string): any {
    // const wei_value = this.web3.toWei(value, 'ether');
    // const hexValue = this.web3.toHex(wei_value);
    // from = EthJS.Util.addHexPrefix(from);
    // to = EthJS.Util.addHexPrefix(to);
    // gasPrice = this.web3.toHex(gasPrice);

    // return this.createTransaction(from, to, { value: hexValue, gasPrice: gasPrice })
    //   .then(tx => this.signAndSerializeTransaction(tx, privateKey))
    //   .then(serialTx => this.sendTransaction(serialTx));
  }



  /**
   * Get balance in given address
   * @param address Account Address
   */
  getAddressInfo(address: string, page: number): Promise<any> {
    const offset = ( page - 1 ) * 10;
    return this.http
      .get(`https://blockchain.info/rawaddr/${address}?limit=10&offset=${offset}`)
      .toPromise()
      .then(res => res.json())
  }
}

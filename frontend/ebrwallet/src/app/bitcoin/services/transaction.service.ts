import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

declare var bitcore: any;

@Injectable()
export class TransactionService {

  constructor(private http: Http) {
  }

  /**
   * Create and send a bitcoin transaction.
   * @param fromaddress
   * @param toaddress
   * @param amount
   * @param privatekey
   */
  createTransaction(fromaddress: string, toaddress: string, amount: string, privatekey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const unit = bitcore.Unit;

      const minerFee = unit.fromMilis(0.128).toSatoshis(); // cost of transaction in satoshis (minerfee)
      const transactionAmount = unit.fromBTC(amount).toSatoshis(); // convert BTC to Satoshis using bitcore unit

      const privateKey = new bitcore.PrivateKey(privatekey);

      if (!bitcore.Address.isValid(fromaddress)) {
        return reject('Origin address checksum failed');
      }
      if (!bitcore.Address.isValid(toaddress)) {
        return reject('Recipient address checksum failed');
      }

      this.getUTXOS(fromaddress)
        .then(utxos => {

          if (utxos.length === 0) {
            // if no transactions have happened, there is no balance on the address.
            return reject('You don\'t have enough Satoshis to cover the miner fee.');
          }

           // get balance
          let balance = unit.fromSatoshis(0).toSatoshis();
          for (let i = 0; i < utxos.length; i++) {
            balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
          }

          // check whether the balance of the address covers the miner fee
          if ((balance - transactionAmount - minerFee) > 0) {

            // create a new transaction
            try {
              const bitcore_transaction = new bitcore.Transaction()
                .from(utxos)
                .to(toaddress, transactionAmount)
                .fee(minerFee)
                .change(fromaddress)
                .sign(privateKey);

              // handle serialization errors
              if (bitcore_transaction.getSerializationError()) {
                const error = bitcore_transaction.getSerializationError().message;
                switch (error) {
                  case 'Some inputs have not been fully signed':
                    return reject('Please check your private key');
                    break;
                  default:
                    return reject(error);
                }
              }

              console.log(bitcore_transaction);
              this.sendRawTransaction(bitcore_transaction.serialize()).then(res => resolve('Succesfully sent')).catch(reject)

            } catch (error) {
              return reject(error.message);
            }
          } else {
            return reject('You don\'t have enough Satoshis to cover the miner fee.');
          }

        });
    });
  }

  /**
   * Sends serialized transaction to the blockchain
   * @param rawtx serialized string of transaction
   */
  sendRawTransaction(rawtx: string): Promise<any> {
    const url = environment.BITCOIN.TRANSACTION_API;
    return this.http
      .post(url, { rawtx: rawtx})
      .toPromise()
      .then(res => res.json());
  }

  /**
   * Get list of transactions for given address
   * @param address Bitcoin Address
   */
  getTransactions(address: string, page: number): Promise<any> {
    const perpage = 10;
    const from = (page - 1) * perpage ;
    const to = (page) * perpage ;
    const url = environment.BITCOIN.TRANSATIONS.replace('ADDRESS', address);
    return this.http
      .get(`${url}?from=${from}&to=${to}`)
      .toPromise()
      .then(res => res.json());
  }

  /**
   * Get the balance in the given address
   * @param address Bitcoin Address
   */
  getBalance(address: string): Promise<any> {
    const url = environment.BITCOIN.BALANCE_API.replace('ADDRESS', address);
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json());
  }

  /**
   * Get the unspent transaction outputs of an address
   * @param address Account Address
   */
  getUTXOS(address: string): Promise<any> {
    const url = environment.BITCOIN.UTXO_API.replace('ADDRESS', address);
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json());
  }
}

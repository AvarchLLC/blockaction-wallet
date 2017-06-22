import { Injectable } from '@angular/core';

import { Wallet } from './wallet'

declare var EthJS : any;

@Injectable()
export class WalletService {

  constructor() { 

  }

  createWallet(passsword : string) : Promise<Wallet> {
    
    var w : Wallet = {
      address: '',
      publicKey: '',
      walletFile: '',
    }

    return new Promise((resolve,reject) => {
      try {
        var wallet = EthJS.Wallet.generate(false)
        w.address = wallet.getAddressString()
        w.publicKey = wallet.getPublicKeyString()
        w.walletFile = wallet.toV3(passsword, { kdf : 'scrypt'})
        resolve(w)
      }
      catch (e) {
        reject(e)
      }
    })
  }

  getPrivateKey(w : Wallet, passsword: String) : Promise<string> {
    
    return new Promise((resolve,reject) => {
      try {
        var wallet = EthJS.Wallet.fromV3(w.walletFile, passsword)
        resolve(wallet.getPrivateKeyString())
      }
      catch(e) {
        reject('Key derivation failed -- possibly wrong password')
      }
    })
  }

  loadWallet() : Promise<Wallet> {
    return new Promise((resolve, reject) => {
      try {
        var localWallet = localStorage.getItem('wallet')
        if ( localStorage !== null ) {
          var wallet: Wallet = JSON.parse(localWallet)
          resolve(wallet)
        } else {
          resolve(false)
        } 
      }
      catch(e) {
        reject('Failed to load wallet from storage.')        
      }
    })
  }

  saveWallet(w: Wallet) : Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('wallet', JSON.stringify(w))
        resolve(true)
      }
      catch(e) {
        reject('Failed to save wallet to storage.')        
      }
    })
  }

  saveWalletToFile(w: Wallet) : Promise<any> {
    return new Promise((resolve, reject) => {
      
      try {
        var fileName = "walletFile"
        var data = JSON.stringify(w)
        var blob = new Blob([data], {type: 'text/json'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }
        else{
            var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = fileName;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false);
            a.dispatchEvent(e);
        }
        resolve(true)
      }
      catch (e) {
        reject("Couldn't save wallet to disk")
      }
    })
  }
}
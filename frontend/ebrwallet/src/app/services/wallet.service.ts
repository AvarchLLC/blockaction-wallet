import { Injectable } from '@angular/core';

import { Wallet } from '../wallet'

declare var EthJS : any;

@Injectable()
export class WalletService {

  constructor() { 

  }

  // creatWallet ... generates a new wallet object and returns encrypted object 
  createWallet(passsword : string) : Promise<Wallet> {
    
    var w : Wallet = new Wallet

    return new Promise((resolve,reject) => {
      try {
        var wallet = EthJS.Wallet.generate(false)
        
        w.address = wallet.getAddressString()
        w.privateKey = wallet.getPrivateKeyString()
        w.fileName = wallet.getV3Filename()

        w.keystore = wallet.toV3(passsword, { kdf : 'scrypt'}) // Encrypts wallet object with scrypt
        
        wallet = null // Set the unencrypted wallet memory to null
        
        resolve(w)
      }
      catch (e) {
        reject(e)
      }
    })
  }

  // getPrivateKey ... decrypts wallet object and returns private key bytes ( not safe )
  getPrivateKey(w : Wallet, password: String) : Promise<string> {
    
    return new Promise((resolve,reject) => {
      try {
        var wallet = EthJS.Wallet.fromV3(w.keystore, password)
        var key = wallet.getPrivateKey()

        wallet = null  // Set the unencrypted wallet memory to null
        password = null
        resolve(key)
      }
      catch(e) {
        reject('Key derivation failed -- possibly wrong password')
      }
    })
  }


  // getPrivateKey ... decrypts wallet object and returns private key string ( not safe )
  getPrivateKeyString(w : Wallet, password: String) : Promise<string> {
    
    return new Promise((resolve,reject) => {
      try {
        var wallet = EthJS.Wallet.fromV3(w.keystore, password)
        var key = wallet.getPrivateKeyString()

        wallet = null  // Set the unencrypted wallet memory to null
        password = null
        resolve(key)
      }
      catch(e) {
        reject('Key derivation failed -- possibly wrong password')
      }
    })
  }

  // loadWallet ... loads wallet object saved in memory
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

  // saveWallet ... saves wallet object to memory
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

  // saveWalletToFile ... saves the encrypted wallet object ( wallet keystore ) to disk
  saveWalletToFile(w: Wallet) : Promise<any> {
    return new Promise((resolve, reject) => {
      
      try {
        var fileName = "walletKeystore"
        var data = JSON.stringify(w.keystore)
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
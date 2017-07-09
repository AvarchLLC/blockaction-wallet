import { Injectable } from '@angular/core';

import { Wallet } from '../wallet'

import qrImage from 'qr-image'
import Identicon from 'identicon.js'

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

  // getQrCode ... create a svg string for qr code of wallet address
  getQrCode(w : Wallet) : Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        var qrString = qrImage.imageSync(w.address, { type: 'svg' })
        var index = qrString.toString().indexOf('d="')
        var lastIndex = qrString.toString().indexOf('/>')
        resolve(qrString.substring(index + 3, lastIndex - 1))
      }
      catch(e){
        reject(e)
      }
    })
  }

  getIdenticon(w: Wallet) : Promise<string> {
    return new Identicon(w.address, 420).toString();
  }

  getPaperWallet(w : Wallet) : Promise<any> {

    return new Promise((resolve,reject) => {
      try {
      // create a base64 encoded PNG
      var identiconData = new Identicon(w.address, 420).toString();

      let privQrCodeData = qrImage.imageSync(w.privateKey, { type: 'svg' });
      let addrQrCodeData = qrImage.imageSync(w.address, { type: 'svg' });
            
      let paperHTML = `
        <!doctype html>
        <html>
        <head>
          <link rel="stylesheet" href="/assets/css/style.css">
          <style>
            .container {
              display : flex;
              flex: 1;
              flex-direction : column;
            }
            .codes {
              display : flex;              
              flex-direction: row;              
            }
            .qrImages {
              display : flex;              
              flex: 4;
              justify-content: center;
              align-items: center;
            }
            #paperwalletidenticon {
              flex: 1;
              justify-content: center;
              align-items: center;    
            }
            .print-address-container {
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
        <div class="container">
          <div class="codes">
            <div class="qrImages">
              <div id="paperwalletprivqr">
                <img width="192" height="192" id='privQrImage' style="display: block;">
              </div>
              <div id="paperwalletaddrqr">
                <img width="192" height="192" id='addrQrImage' style="display: block;">
              </div>
            </div>
            <div id="paperwalletidenticon">
              <img width="192" height="192" id='iconImage' style="display: block;">
            </div>
          </div>
          <div class="print-address-container">
            <p>
              <strong>Your Address:</strong>
              <br><span id="paperwalletadd">${w.address}</span>
            </p>
            <p>
              <strong>Your Private Key:</strong>
            <br><span id="paperwalletpriv">${w.privateKey}</span>
            </p>
          </div>
        </div>
        </body>
        </html>
      `
        resolve({paperHTML,identiconData, privQrCodeData, addrQrCodeData})
      } catch(e){
        console.error(e)
        reject('Couldn\'t generate paper wallet')
      }
    })
  }
  
  // saveWalletToFile ... saves the encrypted wallet object ( wallet keystore ) to disk
  saveWalletToFile(w: Wallet) : Promise<any> {
    return new Promise((resolve, reject) => {
      
      try {
        var fileName : string = w.fileName || "walletKeystore"
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
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Wallet } from '../wallet';

import qrImage from 'qr-image';
import Identicon from 'identicon.js';
import 'rxjs/add/operator/toPromise';

declare var EthJS: any;

@Injectable()
export class WalletService {

  constructor(private http: Http) {

  }

  // creatWallet ... generates a new wallet object and returns encrypted object
  createWallet(passsword: string): Promise<Wallet> {

    const w: Wallet = new Wallet;

    return new Promise((resolve, reject) => {
      try {
        let wallet = EthJS.Wallet.generate(false);

        w.address = wallet.getAddressString();
        w.privateKey = wallet.getPrivateKeyString();
        w.fileName = wallet.getV3Filename();

        w.keystore = wallet.toV3(passsword, { kdf: 'scrypt' }); // Encrypts wallet object with scrypt

        wallet = null; // Set the unencrypted wallet memory to null

        resolve(w);
      } catch (e) {
        reject(e);
      }
    });
  }

  // getPrivateKey ... decrypts wallet object and returns private key bytes ( not safe )
  getPrivateKey(w: Wallet, password: String): Promise<string> {

    return new Promise((resolve, reject) => {
      try {
        let wallet = EthJS.Wallet.fromV3(w.keystore, password);
        const key = wallet.getPrivateKey();

        wallet = null;  // Set the unencrypted wallet memory to null
        password = null;
        resolve(key);
      } catch (e) {
        reject('Key derivation failed -- possibly wrong password');
      }
    });
  }


  // getPrivateKey ... decrypts wallet object and returns private key string ( not safe )
  getPrivateKeyString(w: Wallet, password: String): Promise<string> {

    return new Promise((resolve, reject) => {
      try {
        if (w.keystore['Crypto']) {
          w.keystore['crypto'] = w.keystore['Crypto'];
        }
        const wallet = EthJS.Wallet.fromV3(w.keystore, password);
        const key = wallet.getPrivateKeyString();

        // wallet = null  // Set the unencrypted wallet memory to null
        // password = null
        resolve(key);
      } catch (e) {
        reject('Key derivation failed -- possibly wrong password');
      }
    });
  }

  // getQrCode ... create a svg string for qr code of wallet address
  getQrCode(w: Wallet): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const qrString = qrImage.imageSync(w.address, { type: 'svg' });
        const index = qrString.toString().indexOf('d="');
        const lastIndex = qrString.toString().indexOf('/>');
        resolve(qrString.substring(index + 3, lastIndex - 1));
      } catch (e) {
        reject(e);
      }
    });
  }

  getIdenticon(w: Wallet): Promise<string> {
    return new Identicon(w.address, 420).toString();
  }

  getPaperWallet(w: Wallet): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        // create a base64 encoded PNG
        const identiconData = new Identicon(w.address, 420).toString();

        const privQrCodeData = qrImage.imageSync(w.privateKey, { type: 'svg' });
        const addrQrCodeData = qrImage.imageSync(w.address, { type: 'svg' });

        const paperHTML = `
        <html>
        <head>
          <link rel="stylesheet" href="/assets/css/style.css">
          <style>
            .containers {
              display: flex;
              flex: 1;
              margin: 0;
              flex-direction: column;
            }

            .codes {
              height: 600px;
              border: 1px solid #555;
              align-content: flex-start;
              display: flex;
              flex-direction:column;
              margin: 0 auto;

            }
            .head-logo{ background: #00ACE6; color:#fff; text-align: center; padding:30px;}
            .head-logo img{width: 250px; height: 60px;}
            .Qr-width{width: 250px;}
            .Qr-width h3{margin:5px;}
            .pad-left{padding-left:20px;}
            .qrImages {
              color:#0A7FA7;
              margin:0 10px  0 -10px;
              display: flex;
              flex-direction: row;
              flex: 4;
              justify-content: center;
              align-items: center;
            }
            .bdr-rad{border-radius:10px; padding: 5px;}

            #wallet-icon {
              flex: 1;
              justify-content: center;
              align-items: center;
            }
            .flex-dr{display: inherit;
              flex-direction: column-reverse;
              align-items: center;
            }
            .print-address-container {
              font-size: 17px;
              color:#fff;
              background: #00ACE6;
              justify-content: center;
              align-items: center;
            }
            .bg-img{ background-image: url("/assets/img/ba_logo.svg");
              background-repeat:no-repeat;
              min-height: 50px;
              width:250px;
              align-self: center;
              }
            .head-logo {
              display: flex; flex-direction: column; 
              flex:1; 
              flex-grow: row wrap; 
              align-content: center;
              justify-content: center; 
              color: #fff;
            }
            .head-logo a{ padding:3px 0; margin-top: 10px; font-size:17px;color: #fff; text-decoration:none; }
            
            .bg-img img{display: none;}
            @media print{
                  
              .bg-img{ background-image:none;
                background-repeat:no-repeat;
                height: 50px;
                }
                
              .bg-img img{display: inline;}
              .head-logo a{color: #000;}
            }
          </style>
        </head>

        <body>
          <div class="containers">
            <div class="codes">
            <div class="head-logo">
              <div class="bg-img">
                  <img src="/assets/img/bg_logo.svg" alt="">
              </div>
              <a href="">www.blockaction.io</a>
            </div>
            <div class="qrImages">
              <div id="paperwalletprivqr" class="Qr-width flex-dr">
                  <img width="192" height="192" id="privQrImage" style="display: block;" >
                  <h3 class="txt-dr"> Private Key</h3>
              </div>
              <div id="paperwalletaddrqr" class=" Qr-width flex-dr ">
                  <img width="192" height="192" id="addrQrImage" style="display: block;" >
                  <h3 class="txt-dr"> Address</h3>
              </div>

              <div id="wallet-icon" class="bdr-rad flex-dr">
                <img  class="bdr-rad" width="50" height="50" id="iconImage" style="display: block;">
                <h3 class="txt-dr">Wallet Icon</h3>
              </div>
            </div>
            <div class="print-address-container pad-left">
              <p>
                <strong>Your Address:</strong>
                <br><span id="paperwalletpriv">${w.address}</span>
              </p>
              <p>
                <strong>Your Private Key:</strong>
                <br><span id="paperwalletadd">${w.privateKey}</span>
              </p>

            </div>
        </div>

          </div>
        </body>
        </html>
        `;

        resolve({ paperHTML, identiconData, privQrCodeData, addrQrCodeData });
      } catch (e) {
        console.error(e);
        reject('Couldn\'t generate paper wallet');
      }
    });
  }

  // saveWalletToFile ... saves the encrypted wallet object ( wallet keystore ) to disk
  saveWalletToFile(w: Wallet): Promise<any> {
    return new Promise((resolve, reject) => {

      try {
        const fileName: string = w.fileName || 'walletKeystore';
        const data = JSON.stringify(w.keystore);
        const blob = new Blob([data], { type: 'text/json' });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

          a.download = fileName;
          a.href = window.URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
          e.initEvent('click', true, false);
          a.dispatchEvent(e);
        }
        resolve(true);
      } catch (e) {
        reject('Couldn\'t save wallet to disk');
      }
    });
  }

  getBalance(address: string): Promise<any> {
    return this.http
      .get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest`)
      .toPromise()
      .then(res => res.json())
      .then(res => res.result);
  }

  requestEther(address: string, email: string, value: number): Promise<any> {
    return this.http
      .post('${serverUrl}/api/requestEther', { address, email, value })
      .toPromise()
      .then(res => res.json());
  }
}

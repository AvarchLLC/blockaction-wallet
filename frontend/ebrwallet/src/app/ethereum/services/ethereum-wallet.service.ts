import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import {Wallet} from '../wallet';

import qrImage from 'qr-image';
// import Identicon from 'identicon.js';
import Blockies from 'blockies';

import 'rxjs/add/operator/toPromise';

declare var EthJS: any;

@Injectable()
export class EthereumWalletService {

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
        w.keystore = wallet.toV3(passsword, {kdf: 'scrypt', n: 8192, p: 1}); // Encrypts wallet object with scrypt

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
        let qrString = qrImage.imageSync(w.address, {type: 'svg'});
        let index = qrString.toString().indexOf('d="');
        let lastIndex = qrString.toString().indexOf('/>');
        qrString = qrString.substring(index + 3, lastIndex - 1);
        let qrPrivateString: string = "";
        if (w.privateKey)
          qrPrivateString = qrImage.imageSync(w.privateKey, {type: 'svg'});
        index = qrPrivateString.toString().indexOf('d="');
        lastIndex = qrPrivateString.toString().indexOf('/>');
        qrPrivateString = qrPrivateString.substring(index + 3, lastIndex - 1);
        const qrSvgImage: any = {
          qrString: qrString,
          qrPrivateString: qrPrivateString
        };
        resolve(qrSvgImage);
      } catch (e) {
        reject(e);
      }
    });
  }

  getBlockie(w: Wallet): string {
    return new Blockies({
      seed: EthJS.Util.addHexPrefix(w.address).toLowerCase(),
      size: 8,
      scale: 16
    }).toDataURL();
  }

  getPaperWallet(w: Wallet): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        // create a base64 encoded PNG
        const blockie = this.getBlockie(w);

        const privQrCodeData = qrImage.imageSync(w.privateKey, {type: 'svg'});
        const addrQrCodeData = qrImage.imageSync(w.address, {type: 'svg'});

        const paperHTML = `
        <html>
        <head>
          <link rel="stylesheet" href="/assets/css/style.css">
          <style>
          body { background: none; }
            .containers {

            }

.text-center { text-align: center; }
.text-right { text-align:right; }
            .codes {
              width: 600px; margin:0 auto; padding:40px;
              border: 2px solid teal; box-shadow: 0 0 0 4px #fff, 0 0 0 6px teal;
              margin: 0 auto;

            }
            .col-md-3 { float: left; /*width: 33%;*/ }
            .col-md-6 { float: left; width: 66%; }

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
            .bdr-rad{border-radius:25px; padding: 5px;}
            .blockie-rad{border-radius:25px;}
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
              justify-content: center;
              align-items: center;
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

            @media print{
              .head-logo a{color: #000;}

            }
          </style>
        </head>

        <body>
          <div class="containers">
            <div class="codes" style="position: relative;">
            <div class="row text-center">
              <div class="bg-img col-md-3">
              </div>
              <div class="col-md-6">
              <h1 style="margin-top:0; margin-bottom:30px;">Digital Wallet</h1>
              <div class="qrImages">
              <div id="paperwalletprivqr" class="Qr-width flex-dr">
                  <img width="192" height="192" id="privQrImage" style="display: block;" >
                  <h3 class="txt-dr"> Private Key</h3>
              </div>
              <div id="paperwalletaddrqr" class=" Qr-width flex-dr ">
                  <img width="192" height="192" id="addrQrImage" style="display: block;" >
                  <h3 class="txt-dr"> Address</h3>
              </div>
            </div>
            </div>


              <div id="wallet-icon" class="col-md-3">
              <b>Wallet Icon</b>
                <img  class="blockie-rad" width="50" height="50" id="iconImage" style="display: block;  margin-top: 20px; margin-left: 25px;">
              </div>

              <div style="clear: both"></div>

</div>





            <div class="">
              <p>
                <strong>Your Address:</strong>
                <br><span id="paperwalletpriv">${EthJS.Util.toChecksumAddress(w.address)}</span>
              </p>
              <p>
                <strong>Your Private Key:</strong>
                <br><span id="paperwalletadd">${w.privateKey}</span>
              </p>

            </div>

<div style="position: absolute; right:40px; bottom:150px; vertical-align: middle;">
<span style="display:inline-block;">Total ETH</span> <span style="border:4px solid #91d3c0;width: 50px; height:40px; display: inline-block; background-color:#fff;">
</div>


<div class="text-left">
<img src="../../assets/img/iconLogo.png" style="float: left; margin-right:20px;" />
            <p style="display: inline-block;"><span>Issued by</span>
              <a href="">www.blockaction.io</a>
              </p>

        </div>

          </div>
          </div>
        </body>
        </html>
        `;

        resolve({paperHTML, blockie, privQrCodeData, addrQrCodeData});
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
        const blob = new Blob([data], {type: 'binary'});

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

  readWalletFromFile(uploaded): Promise<Wallet> {
    const wallet = new Wallet;

    return new Promise((resolve, reject) => {
      const file: File = uploaded.files[0];
      const myReader: FileReader = new FileReader();

      myReader.onloadend = function (e) {
        try {
          const res = JSON.parse(myReader.result);
          if (!res.address || !res.version || res.version !== 3) {
            throw true;
          }
          wallet.keystore = res;
          wallet.address = EthJS.Util.addHexPrefix(res.address);
          resolve(wallet);
        } catch (e) {
          reject(null);
        }
      };

      myReader.readAsText(file);
    });
  }
}

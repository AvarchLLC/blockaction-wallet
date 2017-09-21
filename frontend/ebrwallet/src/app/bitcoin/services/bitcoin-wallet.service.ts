import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import {Wallet} from '../wallet';

import qrImage from 'qr-image';
import Blockies from 'blockies';

import BitcoinJS from 'bitcoinjs-lib';
import BIP38 from 'bip38';
import WIF from 'wif';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BitcoinWalletService {

  constructor(private http: Http) {
  }

  /**
   * Generates a new wallet and encrypts it with given password
   * @param password Wallet encryption password
   */
  createWallet(password: string): Promise<Wallet> {

    const w: Wallet = new Wallet;

    return new Promise((resolve, reject) => {
      try {
        var testnet = BitcoinJS.networks.testnet;
        const wallet = BitcoinJS.ECPair.makeRandom({network: testnet});
        w.address = wallet.getAddress();
        w.privateKey = wallet.toWIF();
        resolve(w);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Returns the inner path object of svg string for address qr.
   * @param w Wallet object to return address qr.
   */
  getQrCode(w: Wallet): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        let qrString: string = qrImage.imageSync(w.address, {type: 'svg'});
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

  /**
   * Returns the Blockie image/png for address of a wallet
   * @param w Wallet object to get address blockie
   */
  getBlockie(w: Wallet): string {
    return new Blockies({
      seed: w.address.toLowerCase(),
      size: 8,
      scale: 16
    }).toDataURL();
  }

  /**
   * Returns plain html for paper wallet with embedded wallet info
   * @param w Wallet object to generate paper wallet
   */
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
            <div class="head-logo">
              <div class="bg-img">
                  <img src="/assets/img/bitcon.png" style="max-width:70px;" alt="">
              </div>
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
                <img  class="blockie-rad" width="50" height="50" id="iconImage" style="display: block;">
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

        resolve({paperHTML, blockie, privQrCodeData, addrQrCodeData});
      } catch (e) {
        console.error(e);
        reject('Couldn\'t generate paper wallet');
      }
    });
  }
}

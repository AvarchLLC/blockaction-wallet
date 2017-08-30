import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Wallet } from '../wallet';

import qrImage from 'qr-image';
import Blockies from 'blockies';

import BitcoinJS from 'bitcoinjs-lib';
import BIP38 from 'bip38';
import WIF from 'wif';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class WalletService {

  constructor(private http: Http) { }

  /**
   * Generates a new wallet and encrypts it with given password
   * @param password Wallet encryption password
   */
  createWallet(password: string): Promise<Wallet> {

    const w: Wallet = new Wallet;

    return new Promise((resolve, reject) => {
      try {
        const wallet = BitcoinJS.ECPair.makeRandom();
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
        const qrString = qrImage.imageSync(w.address, { type: 'svg' });
        const index = qrString.toString().indexOf('d="');
        const lastIndex = qrString.toString().indexOf('/>');
        resolve(qrString.substring(index + 3, lastIndex - 1));
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
            .head-logo{ background: #1ed6e5; color:#fff; text-align: center; padding:30px;}
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
              color:#fff;
              background: #1ed6e5;
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
            <div class="codes">
            <div class="head-logo">
              <div class="bg-img">
                  <img src="/assets/img/logo.svg" alt="">
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

        resolve({ paperHTML, blockie , privQrCodeData, addrQrCodeData });
      } catch (e) {
        console.error(e);
        reject('Couldn\'t generate paper wallet');
      }
    });
  }
}

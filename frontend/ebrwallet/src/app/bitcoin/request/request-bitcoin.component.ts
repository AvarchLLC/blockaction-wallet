import {Component, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BitcoinTransactionService } from '../services/bitcoin-transaction.service';
import { DataService } from '../../services/data.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

import { Wallet } from '../wallet';

import {SpinnerService} from '../../services/spinner.service';
import { Config } from '../../config';
const config = new Config();

declare const toastr: any;
declare var EthJS: any;
declare var bitcore: any;

@Component({
  selector: 'request-bitcoin-component',
  templateUrl: './request-bitcoin.component.html',
  styleUrls:['request-bitcoin.component.css']
})

export class RequestBitcoinComponent {

  sendBitcoin: FormGroup;

  wallet: Wallet;
  btcusd: any;
  bitcoinAddress: string;
  addressProvided:boolean = false;

  modalVisible = false;

  showSpinner = false;
  ready= false;

  scanQr:boolean =false;
  qrSvg: string;   // QrCode SVG string
  qrClass = '';


  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }
  constructor( fb: FormBuilder,
    private transactionService: BitcoinTransactionService,
    private dataService: DataService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private spinner: SpinnerService
  ) {

    this.sendBitcoin = fb.group({
      email: ['', Validators.email],
      message : ['', Validators.required],
      amount_bitcoin: ['0', Validators.required],
      amount_usd: ['0', Validators.required],

    });


      this.dataService
      .getCoinData('bitcoin')
      .then(coinData => {
        this.btcusd = coinData[0].price_usd; // The exchange rate for bitcoin
      });

  }

  requestBitcoin() {

    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Request Bitcoin');

    const email = this.sendBitcoin.value.email;
    const amount = this.sendBitcoin.value.amount_bitcoin;
    const message = this.sendBitcoin.value.message;
    const str = `Bitcoin request sent to ${email} for ${amount} btc.`;

    this.dataService
      .requestBitcoin(this.bitcoinAddress, email, amount,message)
      .then(ok => {
        toastr.success(str, 'Request Bitcion');
        this.sendBitcoin.reset();
      })
      .catch(err => toastr.error('Couldn\'t send request at the moment.'));

  }

  converter(data) {
    this.sendBitcoin.controls.amount_bitcoin.setValue(data.baseValue);
    this.sendBitcoin.controls.amount_usd.setValue(data.quoteValue);
  }


  isValidPrivateKey(address: string) {
    return bitcore.Address.isValid(address);
  }

  decodedQrOutput(address) {
    if (!this.isValidPrivateKey(address)) {
      this.scanQr = false;
      toastr.error('Not a valid address.');
    } else {
      toastr.success('Successfully scanned address.');
      this.scanQr = false;
      this.bitcoinAddress = address;
    }
  }


  showNextForm(){
      this.addressProvided = true;
  }

}

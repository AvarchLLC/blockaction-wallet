import {DataService} from '../../services/data.service';
import {Component, OnInit, Inject, Output, EventEmitter, Input, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BitcoinWalletService} from '../services/bitcoin-wallet.service';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import {BitcoinTransactionService} from '../services/bitcoin-transaction.service';

import {Wallet} from '../wallet';
import {SpinnerService} from '../../services/spinner.service';
import {Config} from '../../config';
const config = new Config();

declare const toastr: any;


@Component({
  selector: 'app-bitcoin-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})

export class WalletComponent implements OnInit {

  requestBitcoinForm: FormGroup;

  wallet: Wallet;
  ethusd: any;

  qrSvg: string;   // QrCode SVG string
  qrClass = '';
  qrPrivate: string = '';
  btcusd: number;

  modalVisible = false;
  blockie: any;
  ready = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              private walletService: BitcoinWalletService,
              private googleAnalyticsService: GoogleAnalyticsService,
              private transactionService: BitcoinTransactionService,
              private spinner: SpinnerService,
              private dataService: DataService) {

    this.requestBitcoinForm = fb.group({
      email: ['', Validators.email],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0'],
      message: ['', Validators.required]
    });
  }

  // Get the current exchange rate for bitcoin.
  ngOnInit(): void {
    this.dataService.getCoinData('bitcoin')
      .then(data => this.btcusd = parseFloat(data[0].price_usd))
      .catch(err => toastr.error('Couldn\'t get exchange rate'));

    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date()) {
      this.ready = true;
    }
  }

  // Get the qr code for address.
  showQr(): void {
    if (this.wallet) {
      this.walletService
        .getQrCode(this.wallet)
        .then((qrCode: any) => {
          this.qrSvg = qrCode.qrString;
          this.qrPrivate = qrCode.qrPrivateString;
        });
      ;
    }
  }

  // Toggle the css class for qr image
  qrToggle() {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Show Qr');

    this.qrClass === ''
      ? this.qrClass = 'showQr'
      : this.qrClass = '';
  }

  // Set the privacy message shown flag
  isReady() {
    this.ready = true;
    const messageExpiry = new Date();
    messageExpiry.setHours(messageExpiry.getHours() + 1);
    localStorage.setItem('messageShown', messageExpiry.toString());
  }

  //
  create(): void {

    this.googleAnalyticsService
      .emitEvent('Bitcoin Wallet Creation', 'Created');

    this.spinner.displaySpiner(true);
    setTimeout(function () {
      this.walletService
        .createWallet()
        .then(data => {
          this.wallet = data;
          this.showQr();
          this.blockie = this.walletService.getBlockie(this.wallet);
          toastr.success('Successful!', 'Wallet Creation');
          this.spinner.displaySpiner(false);
        })
        .catch(err => {
          toastr.error('dAn Error Occurred', 'Wallet Creation');
          this.spinner.displaySpiner(false);
        });
    }.bind(this), 1000);

  }

  printPaperWallets() {
    this.googleAnalyticsService
      .emitEvent('Post Bitcoin Wallet Creation', 'Print Bitcoin Wallet');

    this.walletService.getPaperWallet(this.wallet).then(data => {
      const win = window.open('about:blank', 'rel="noopener"', '_blank');
      win.document.write(data.paperHTML);
      win.document.getElementById('privQrImage').setAttribute('src', 'data:image/svg+xml;base64,' + window.btoa(data.privQrCodeData));
      win.document.getElementById('addrQrImage').setAttribute('src', 'data:image/svg+xml;base64,' + window.btoa(data.addrQrCodeData));
      win.document.getElementById('iconImage').setAttribute('src', data.blockie);

      setTimeout(function () {
        win.print();
      }, 3000);
    }).catch(err => toastr.error(err));
  }

  requestBitcoin() {
    this.googleAnalyticsService
      .emitEvent('Post Bitcoin Wallet Creation', 'Request Bitcoin');

    this.modalVisible = false;

    const email = this.requestBitcoinForm.controls.email.value;
    const amount = this.requestBitcoinForm.controls.amount_ether.value;
    const str = `Bitcoin request sent to ${email} for ${amount} BTC.`;

    toastr.success(str, 'Request BTC');
  }

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  converter(data) {
    this.requestBitcoinForm.controls.amount_ether.setValue(data.baseValue);
    this.requestBitcoinForm.controls.amount_usd.setValue(data.quoteValue);
  }


}

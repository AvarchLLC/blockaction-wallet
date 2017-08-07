import {Component, OnInit, Inject, Output, EventEmitter, Input, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WalletService } from '../services/wallet.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

import { Wallet } from '../wallet';

import {SpinnerService} from '../../services/spinner.service';
import { Config } from '../../config';
const config = new Config();

declare const toastr: any;


@Component({
  selector: 'app-bitcoin-wallet',
  templateUrl: './wallet.component.html'
})

export class WalletComponent implements OnInit {

  requestBitcoinForm: FormGroup;

  wallet: Wallet;
  ethusd: any;

  qrSvg: string;   // QrCode SVG string
  qrClass = '';

  modalVisible = false;
  blockie: any;
  ready= false;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }
  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private walletService: WalletService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private spinner: SpinnerService
  ) {

    this.requestBitcoinForm = fb.group({
      email: ['', Validators.email],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0'],
      message : ['', Validators.required]
    });
  }

  ngOnInit(): void {

    // this.transactionService
    //   .getConversionRate('ethusd')
    //   .then(res => {
    //     this.ethusd = {
    //       value: res.bid,
    //       time: new Date(res.timestamp * 1000)
    //     };
    //   })
    //   .catch(err => toastr.error('Couldn\'t get exchange rate'));

    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date() ) {
      this.ready = true;
    }
  }

  showQr(): void {
    if (this.wallet) {
      this.walletService
        .getQrCode(this.wallet)
        .then(qrCode => this.qrSvg = qrCode);
    }
  }

  qrToggle() {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Show Qr');

    this.qrClass === ''
      ? this.qrClass = 'showQr'
      : this.qrClass = '';
  }


  isReady() {
    this.googleAnalyticsService
      .emitEvent('Wallet Page', 'Button Clicked', 'Ok, Got It');
    this.ready = true;
    const messageExpiry = new Date();
    messageExpiry.setHours(messageExpiry.getHours() + 1);
    localStorage.setItem('messageShown', messageExpiry.toString());
  }

  create(): void {

    this.googleAnalyticsService
      .emitEvent('Wallet Creation', 'Button Clicked');

    this.spinner.displaySpiner(true);
    setTimeout(function () {
      this.walletService
        .createWallet()
        .then(data => {
          this.wallet = data;
          toastr.success('Created!', 'Wallet Creation');
          this.showQr();
          this.spinner.displaySpiner(false);

        })
        .catch(err => {
          toastr.error('An Error Occurred', 'Wallet Creation');
          this.spinner.displaySpiner(false);          
        });
    }.bind(this), 1000);

  }

  saveWalletToFile(): void {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Download Wallet');

    this.walletService
      .saveWalletToFile(this.wallet)
      .then(ok => {
        console.log('emitting card show object');
        // this.on_card_show.emit(true);
      })
      .catch(err => toastr.error('An error occurred while downloading', 'Wallet Download'));
  }

  deleteWallet(): void {
    this.wallet = null;
    this.qrSvg = null;
  }

  printPaperWallets() {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Print Wallet');

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
      .emitEvent('Post Wallet Creation', 'Request Ether');

    this.modalVisible = false;

    const email = this.requestBitcoinForm.controls.email.value;
    const amount = this.requestBitcoinForm.controls.amount_ether.value;
    const str = `Ether request sent to ${email} for ${amount} ether.`;

    toastr.success(str, 'Request Ether');
  }

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  converter(data) {
    this.requestBitcoinForm.controls.amount_ether.setValue(data.baseValue);
    this.requestBitcoinForm.controls.amount_usd.setValue(data.quoteValue);
  }

}

import {Component, OnInit, Inject, Output, EventEmitter, Input, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

import { Wallet } from '../wallet';

import {SpinnerService} from '../../services/spinner.service';
import { Config } from '../../config';
const config = new Config();

declare const toastr: any;

// toastr.options = config.toastr;

@Component({
  selector: 'app-ethereum-wallet',
  templateUrl: './wallet.component.html'
})

export class WalletComponent implements OnInit {

  walletForm: FormGroup;
  requestEtherForm: FormGroup;

  @Input() reset = true; // Wallet object
  @Output() on_card_show: EventEmitter<boolean> = new EventEmitter();  // Wallet object
  @Output() on_wallet_creation: EventEmitter<Wallet> = new EventEmitter();  // Wallet object
  wallet: Wallet;

  qrSvg: string;   // QrCode SVG string
  ethusd: any;

  disabled = false; // disable "create wallet" button
  passphraseType = 'password';
  passphraseButton = 'Show Passphrase';
  qrClass = '';
  modalVisible = false;

  blockie: any;
  showSpinner = false;
  ready= false;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }
  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private walletService: WalletService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private spinner: SpinnerService
  ) {

    const passwordValidator = Validators.compose([
      Validators.required
    ]);

    this.walletForm = fb.group({
      password: ['', [passwordValidator]],
    });

    this.requestEtherForm = fb.group({
      email: ['', Validators.email],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0'],
      message : ['', Validators.required]
    });
  }

  passwordCheck(password: string) {

    const checked = {
      passwordLength: password.length >= 8 && password.length <= 20 ,
      passwordLowercase: /[a-z]/.test(password),
      passwordUppercase: /[A-Z]/.test(password),
      passwordNumber: /[0-9]/.test(password),
      passwordSpecialchar : /[@#$%^&+=!*]/.test(password),
      invalidChar: /[^a-zA-Z0-9@#$%^&+=!*]/.test(password)
    };

    checked['all'] =
      checked.passwordLength &&
      checked.passwordLowercase &&
      checked.passwordUppercase &&
      checked.passwordNumber &&
      checked.passwordSpecialchar;

    return checked;
  }

  ngOnInit(): void {

    this.transactionService
      .getPrice()
      .then(res => {
        this.ethusd = {
          value: res.ethusd,
          time: new Date(res.ethusd_timestamp * 1000)
        };
      })
      .catch(err => toastr.error('Couldn\'t get exchange rate'));

    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date() ) {
      this.ready = true;
    }
  }

  goBack() {
    // if (this.showCreate && this.wallet) {
    //   const confirmMsg = 'You haven\'t downloaded wallet yet. If you go back, you will lose your wallet.';
    //   if (confirm(confirmMsg)) {
    //       this.wallet = null;
    //       this.walletComponent.wallet = null;
    //   }
    //   return;
    // }
  }

  get isDisabled() {
    return this.disabled || !this.walletForm.valid || !this.passwordCheck(this.walletForm.controls.password.value)['all'];
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

  passphraseToggle() {
    this.googleAnalyticsService
      .emitEvent('Wallet Form', 'Show Passphrase Toggle');

    this.passphraseType === 'password'
      ? this.passphraseType = 'text'
      : this.passphraseType = 'password';

    this.passphraseButton === 'Show Passphrase'
      ? this.passphraseButton = 'Hide Passphrase'
      : this.passphraseButton = 'Show Passphrase';
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
    this.disabled = true;
    setTimeout(function () {
      this.walletService
        .createWallet(this.walletForm.value.password)
        .then(data => {
          this.wallet = data;
          this.walletForm.controls.password.setValue('');
          toastr.success('Created!', 'Wallet Creation');
          this.showQr();
          this.blockie = this.walletService.getBlockie(this.wallet);
          this.disabled = false;
          this.spinner.displaySpiner(false);
          this.on_wallet_creation.emit(this.wallet);

        })
        .catch(err => {
          // console.error(err);
          toastr.error('An Error Occurred', 'Wallet Creation');
          this.disabled = false;
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
        this.on_card_show.emit(true);
      })
      .catch(err => toastr.error('An error occurred while downloading', 'Wallet Download'));
  }

  deleteWallet(): void {
    this.wallet = null;
    this.qrSvg = null;
    // this.password = null
    // this.privateKey = null
    // this.file = null
    // this.filePassword = null
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

  requestEther() {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Request Ether');

    this.modalVisible = false;

    const email = this.requestEtherForm.controls.email.value;
    const amount = this.requestEtherForm.controls.amount_ether.value;
    const str = `Ether request sent to ${email} for ${amount} ether.`;

    this.walletService
      .requestEther(this.wallet.address, email, amount)
      .then(ok => {

      });

    toastr.success(str, 'Request Ether');
  }

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  etherAmountChanged(e, form) {
    const ether_value = parseFloat(e.target.value);
    if (ether_value !== 0 && e.target.value.length > ether_value.toString().length) {
      e.target.value = ether_value;
    }
    if (ether_value && !isNaN(ether_value) && ether_value > 0) {
      const amount_in_usd = ether_value * this.ethusd.value;
      form.controls.amount_usd.setValue(amount_in_usd);
    }
  }

  usdAmountChanged(e, form) {
    const usd_value = parseFloat(e.target.value);
    if (usd_value !== 0 && e.target.value.length > usd_value.toString().length) {
      e.target.value = usd_value;
    }
    if (usd_value && !isNaN(usd_value) && usd_value > 0) {
      const amount_in_ether = usd_value / this.ethusd.value;
      form.controls.amount_ether.setValue(amount_in_ether);
    }
  }

}
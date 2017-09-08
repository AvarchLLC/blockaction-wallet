import {Component, OnInit, Inject, Output, EventEmitter, Input, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {EthereumWalletService} from '../services/ethereum-wallet.service';
import {EthereumTransactionService} from '../services/ethereum-transaction.service';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';

import {Wallet} from '../wallet';

import {SpinnerService} from '../../services/spinner.service';
import {Config} from '../../config';
import {Router} from '@angular/router';
const config = new Config();

declare const toastr: any;
declare var EthJS: any;
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
  ethusd: any;

  qrSvg: string;   // QrCode SVG string
  qrClass = '';

  disabled = false; // disable "create wallet" button
  passphraseType = 'password';
  passphraseButton = 'Show Passphrase';
  modalVisible = false;
  walletCreated: boolean = false;
  walletDownload: boolean = false;
  blockie: any;
  showSpinner = false;
  ready = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              private walletService: EthereumWalletService,
              private authService: AuthService,
              private transactionService: EthereumTransactionService,
              private dataService: DataService,
              private googleAnalyticsService: GoogleAnalyticsService,
              private spinner: SpinnerService,
              private router: Router) {

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
      message: ['', Validators.required]
    });
  }

  passwordCheck(password: string) {

    const checked = {
      passwordLength: password.length >= 8 && password.length <= 20,
      passwordLowercase: /[a-z]/.test(password),
      passwordUppercase: /[A-Z]/.test(password),
      passwordNumber: /[0-9]/.test(password),
      passwordSpecialchar: /[@#$%^&+-=!*]/.test(password),
      invalidChar: /[^a-zA-Z0-9@#$%^&+-=!*]/.test(password)
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
      .getConversionRate('ethusd')
      .then(res => {
        this.ethusd = {
          value: res.bid,
          time: new Date(res.timestamp * 1000)
        };
      })
      .catch(err => toastr.error('Couldn\'t get exchange rate'));

    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date()) {
      this.ready = true;
    }
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
          this.walletCreated = true;
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

  toChecksum(address) {
    return EthJS.Util.toChecksumAddress(address);
  }

  saveWalletToFile(): void {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Download Wallet');

    this.walletService
      .saveWalletToFile(this.wallet)
      .then(ok => {
        this.walletDownload = true;
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

    this.dataService
      .requestEther(this.wallet.address, email, amount)
      .then(ok => {
        toastr.success(str, 'Request Ether');
      })
      .catch(err => toastr.error('Couldn\'t send request at the moment.'));

  }

  toggleModal() {
    this.router.navigate(['ethereum/request']);
  }

  converter(data) {
    this.requestEtherForm.controls.amount_ether.setValue(data.baseValue);
    this.requestEtherForm.controls.amount_usd.setValue(data.quoteValue);
  }

}

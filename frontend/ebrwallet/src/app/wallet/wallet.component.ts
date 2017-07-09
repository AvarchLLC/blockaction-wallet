import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WalletService } from '../services/wallet.service'
import { AuthService } from '../services/auth.service'

import { Wallet } from '../wallet'


declare var toastr: any;

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})

export class WalletComponent implements OnInit {

  // file : any
  // filePassword: string
  // privateKey: string
  walletForm : FormGroup; 
  requestEtherForm : FormGroup;

  wallet     : Wallet  // Wallet object
  qrSvg      : string  // QrCode SVG string


  disabled        : boolean = false // disable "create wallet" button
  slideClass      : string  = ''
  passphraseType  : string  = 'password'
  passphraseButton: string  = 'Show Passphrase'
  qrClass         : string  = ''
  modalVisible    : boolean = false

  identicon       : any
  ready           : boolean = false

  constructor(@Inject(FormBuilder) fb: FormBuilder, private walletService: WalletService, private authService: AuthService) {
    var passwordValidator = Validators.compose([
                              Validators.required,
                              Validators.maxLength(20),
                              Validators.pattern(/^.*(?=.{7,20})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=])[a-zA-Z0-9@#$%^&+=]*$/)
                            ]);

    this.walletForm = fb.group({
      password: ['', [ passwordValidator ]],
    })

    this.requestEtherForm = fb.group({
      email: ['', Validators.email],
      amount: [''],
      comment : ['']
    })
  }

  ngOnInit(): void {

  }

  get isDisabled() {
    return this.disabled || !this.walletForm.valid
  }

  showQr(): void {
    if (this.wallet) {
      this.walletService
          .getQrCode(this.wallet)
          .then(qrCode => this.qrSvg = qrCode)
    }
  }
  
  isReady() {
    this.ready = true;
  }
  qrToggle() {
    this.qrClass === ''
      ? this.qrClass = 'showQr'
      : this.qrClass = ''

    console.log(this.qrClass)
  }
  passphraseToggle() {
    this.passphraseType === 'password'
      ? this.passphraseType = 'text'
      : this.passphraseType = 'password'

    this.passphraseButton === 'Show Passphrase'
      ? this.passphraseButton = 'Hide Passphrase'
      : this.passphraseButton = 'Show Passphrase'
  }

  // Decrypt private key from wallet keystore file
  // getKey() : void {

  // this.walletService
  //   .getPrivateKeyString(this.wallet ,this.filePassword)
  //   .then(key => {
  //     this.privateKey= key;
  //     this.filePassword = null;
  //     toastr.success('Wallet decrypted', "Show Private Key")

  //   })
  //   .catch(err => {
  //     this.filePassword = null
  //     toastr.error('Incorrect Password', "Show Private Key")
  //   })
  // }



  create(): void {

    this.disabled = true

    setTimeout(function () {
      this.walletService
        .createWallet(this.walletForm.value.password)
        .then(data => {
          this.wallet = data
          this.walletForm.controls.password.setValue('')
          this.slideClass = 'slide'
          toastr.success('Created!', "Wallet Creation")
          this.showQr()
          this.identicon = this.walletService.getIdenticon(this.wallet);    
          // document.getElementById('iconImage').setAttribute('src','data:image/png;base64,'+ this.identicon)            
          
          this.disabled = false
        })
        .catch(err => {
          console.error(err)
          // toastr.error("An Error Occurred", "Wallet Creation")
          this.disabled = false
        })
    }.bind(this), 1000)

  }

  saveWalletToFile(): void {
    this.walletService
      .saveWalletToFile(this.wallet)
      .catch(err => toastr.error("An error occurred while downloading", "Wallet Download"))
  }


  /*  Loading wallet by file upload
   *
   *
  fileChangeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any) : void {
    var self = this;
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = function(e){
      self.loadWalletFromString(myReader.result)
    }
    myReader.readAsText(file);
  }
  loadWalletFromString(s: string): void {
    try {
      this.wallet  = {
        keystore: JSON.parse(s),
        address : JSON.parse(s).address
      }
    }catch(e){
      toastr.error("Cannot read from wallet file.", "Load Wallet")
    }

    this.showQr();
  }
  */

  deleteWallet(): void {
    this.wallet = null;
    this.qrSvg = null
    // this.password = null
    // this.privateKey = null
    // this.file = null
    // this.filePassword = null
  }

  printPaperWallets(strJson) {
    this.walletService.getPaperWallet(this.wallet).then(data => {
      var win = window.open("about:blank", "rel='noopener'", "_blank");
      win.document.write(data.paperHTML)
      win.document.getElementById('privQrImage').setAttribute('src','data:image/svg+xml;base64,'+ window.btoa(data.privQrCodeData))
      win.document.getElementById('addrQrImage').setAttribute('src','data:image/svg+xml;base64,'+ window.btoa(data.addrQrCodeData))      
      win.document.getElementById('iconImage').setAttribute('src','data:image/png;base64,'+ data.identiconData)            
    }).catch(err => toastr.error(err))
  }

  requestEther() {
    this.modalVisible = false;

    let em = this.requestEtherForm.controls.email.value;
    let am = this.requestEtherForm.controls.amount.value;
    let str = `Ether request sent to ${em} for ${am} ether.`
    toastr.success(str, 'Request Ether')
  }
  showModal() {
    this.modalVisible = true;
  }

  cancelModal() {
    this.modalVisible = false;
  }
}

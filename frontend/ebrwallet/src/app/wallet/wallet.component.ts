import { Component, OnInit } from '@angular/core';

import { WalletService } from '../services/wallet.service'
import { AuthService } from '../services/auth.service'

import { Wallet } from '../wallet'

import qrImage from 'qr-image'

declare var toastr : any;

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
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})

export class WalletComponent implements OnInit {

  // file : any
  // filePassword: string
  // privateKey: string
  
  wallet : Wallet 
  password: string
  qrSvg
  
  constructor(private walletService : WalletService, private authService : AuthService) { }

  ngOnInit(): void {
    
  }

  showQr() : void {
    if( this.wallet ) {
      // create a svg string for qr code of wallet address
      var qrString = qrImage.imageSync(this.wallet.address, { type: 'svg'})
      var index= qrString.toString().indexOf('d="')
      var lastIndex = qrString.toString().indexOf('/>')
      this.qrSvg = qrString.substring(index + 3, lastIndex - 1)
    }
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
    this.walletService
      .createWallet(this.password)
      .then(data => {
        this.wallet = data
        this.password = null
        toastr.success('Created!', "Wallet Creation")
        this.showQr()
      })
      .catch(err => toastr.error("An Error Occurred", "Wallet Creation"))
  }

  saveWalletToFile() :void {
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

  deleteWallet() : void {
    this.wallet = null;
    this.file = null
    this.password = null
    this.privateKey = null
    this.filePassword = null
    this.qrSvg = null
  }

}
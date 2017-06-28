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
  templateUrl: './wallet.component.html'
})

export class WalletComponent implements OnInit {

  file : any
  wallet : Wallet 
  password: string
  privateKey: string
  filePassword: string
  qrSvg
  random: string = (Math.random() * 100).toString().split('.')[0];
  isLoggedIn;
  
  constructor(private walletService : WalletService, private authService : AuthService) { }

  ngOnInit(): void {
    // this.isLoggedIn = this.authService.authenticated;
    // this.walletService
    //   .loadWallet()
    //   .then(wallet => {
    //     if(wallet) {
    //       this.wallet = wallet
    //       this.showQr()
    //       toastr.success('Wallet loaded successfully!', 'Wallet')
    //     }
    //   })
    //   .catch(err => toastr.warning("Couldn't load local wallet", 'Wallet'))
    
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

  getKey() : void {

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
  }

  // // watch for wallet file upload
  // fileChangeListener($event) : void {
  //   this.readThis($event.target); 
  // }

  // readThis(inputValue: any) : void {
  //   var self = this;
  //   var file:File = inputValue.files[0]; 
  //   var myReader:FileReader = new FileReader();
     
  //   myReader.onloadend = function(e){
  //     self.loadWalletFromString(myReader.result)
  //   }
  //   myReader.readAsText(file);
  // }


  create(): void {
    this.walletService
      .createWallet(this.password)
      .then(data => {
        this.wallet = data
        this.password = null
        toastr.success('Created!', "Wallet Creation")
        this.showQr()
        // this.walletService
        //   .saveWallet(this.wallet)
        //   .then()
        //   .catch(err => console.log("Errors", err))
      })
      .catch(err => toastr.error("An Error Occurred", "Wallet Creation"))
  }

  saveWalletToFile() :void {
    this.walletService
      .saveWalletToFile(this.wallet)
      .catch(err => toastr.error("An error occurred while downloading", "Wallet Download"))
  }

  // loadWalletFromString(s: string): void {
  //   try {
  //     this.wallet  = {
  //       keystore: JSON.parse(s),
  //       address : JSON.parse(s).address
  //     }
  //   }catch(e){
  //     toastr.error("Cannot read from wallet file.", "Load Wallet")
  //   }

  //   this.showQr();
  //   this.walletService
  //     .saveWallet(this.wallet)
  //     .then()
  //     .catch(err => console.error("errors", err))
  // }

  deleteWallet() : void {
    this.wallet = null;
    this.file = null
    this.password = null
    this.privateKey = null
    this.filePassword = null
    this.qrSvg = null
    // localStorage.clear()
  }

  logout() : void {
    this.authService.logout()
  }

}
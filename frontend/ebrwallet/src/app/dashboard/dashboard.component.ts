import { Component, OnInit } from '@angular/core';

import { WalletService } from '../wallet.service'
import { AuthService } from '../auth.service'

import { Wallet } from '../wallet'

import qrImage from 'qr-image'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

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
    this.isLoggedIn = this.authService.authenticated;
    this.walletService
      .loadWallet()
      .then(wallet => {
        if(wallet) {
          this.wallet = wallet
          this.showQr()
        }
      })
      .catch(err => console.error("Errors", err))
    
  }

  showQr() : void {
    if( this.wallet ) {
      var qrString = qrImage.imageSync(this.wallet.address, { type: 'svg'})
      var index= qrString.toString().indexOf('d="')
      var lastIndex = qrString.toString().indexOf('/>')
      this.qrSvg = qrString.substring(index + 3, lastIndex - 1)
    }
  }

  getKey() : void {

    this.walletService
      .getPrivateKeyString(this.wallet ,this.filePassword)
      .then(key => { 
        this.privateKey= key;
        console.log('priv key', key)
        this.filePassword = null;
      })
      .catch(err => {
        console.error("errors", err); 
      })
  }

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


  create(): void {
    this.walletService
      .createWallet(this.password)
      .then(data => {
        this.wallet = data
        this.password = null
        this.showQr()
        this.walletService
          .saveWallet(this.wallet)
          .then()
          .catch(err => console.log("Errors", err))
      })
      .catch(err => console.error("errors", err))
  }

  saveWalletToFile() :void {
    this.walletService
      .saveWalletToFile(this.wallet)
      .catch(err => console.error(err))
  }

  loadWalletFromString(s: string): void {
    this.wallet  = {
      keystore: JSON.parse(s),
      address : JSON.parse(s).address
    }

    this.showQr();
    this.walletService
      .saveWallet(this.wallet)
      .then()
      .catch(err => console.error("errors", err))
  }

  deleteWallet() : void {
    this.wallet = null;
    localStorage.clear()
  }

  logout() : void {
    this.authService.logout()
  }

}
import { Component, OnInit } from '@angular/core';

import { WalletService } from '../wallet.service'

import { Wallet } from '../wallet'

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
  etherValue = 10;
  filePassword: string

  constructor(private walletService : WalletService) { }


  ngOnInit(): void {
    this.walletService
      .loadWallet()
      .then(wallet => {
        if(wallet) {
          this.wallet = wallet
        }
      })
      .catch(err => console.error("Errors", err))
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

    this.walletService
      .saveWallet(this.wallet)
      .then()
      .catch(err => console.error("errors", err))
  }

  deleteWallet() : void {
    this.wallet = null;
    localStorage.clear()
  }

}
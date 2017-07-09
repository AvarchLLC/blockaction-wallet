import { Component, OnInit,Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service'
import { TransactionService } from '../services/transaction.service' 

declare var toastr: any;
declare var EthJS : any;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendMoney: FormGroup;
  message = ''  
  error = ''

  constructor(@Inject(FormBuilder) fb: FormBuilder, private route: ActivatedRoute, private transactionService: TransactionService, private walletService: WalletService) {

    this.sendMoney = fb.group({
      receiveAddress: ['', Validators.required],
      amount: ['', Validators.required] ,
      privatekey : ['']
    })
  }

  onSubmit() {
  }
  
  // checkAddressValidity(publicAddr : string , privateAddr: string) {
  //   if (EthJS.Util.isValidPublicAddress(publicAddr) && (this.sendMoney.controls.privatekey!=='' || EthJS.Util.isValidPrivateAddress )) {
  //     return true
  //   }
  // }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.to || params.value) 
      .subscribe(params => {
        this.sendMoney.setValue({ 
          receiveAddress: params.to, 
          amount: params.value,
          privatekey: ''
        })        
        console.log(this.transactionService.createTransaction('0x2324434242',params.to,{ value: params.value }))
      });
  }

  /*  Loading wallet by file upload 
   *
   *
   * */
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
      // throw "err"
      
      toastr.success("Valid wallet file", "Wallet")
    }
    catch(e){
      toastr.error("Cannot read from wallet file.", "Wallet")
    }

  }
  

}

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
  ethusd : any

  constructor(@Inject(FormBuilder) fb: FormBuilder, private route: ActivatedRoute, private transactionService: TransactionService, private walletService: WalletService) {

    this.sendMoney = fb.group({
      receiveAddress: ['', Validators.required],
      amount_ether: ['0', Validators.required] ,
      amount_usd: ['0', Validators.required],
      privatekey : ['']
    })

    this.route.queryParams
      .filter(params => params.to || params.value) 
      .subscribe(params => {
        this.sendMoney.setValue({ 
          receiveAddress: params.to, 
          amount_ether: params.value,
          amount_usd: 0,
          privatekey: ''
        })        
        // console.log(this.transactionService.createTransaction('0x2324434242',params.to,{ value: params.value }))
      });
  }

  onSubmit() {
  }
  
  // checkAddressValidity(publicAddr : string , privateAddr: string) {
  //   if (EthJS.Util.isValidPublicAddress(publicAddr) && (this.sendMoney.controls.privatekey!=='' || EthJS.Util.isValidPrivateAddress )) {
  //     return true
  //   }
  // }

  ngOnInit() {

    this.transactionService
      .getPrice()
      .then(res => {
        this.ethusd = {
          value: res.ethusd,
          time : new Date(res.ethusd_timestamp * 1000)
        }
        
        let ether_val = parseFloat(this.sendMoney.controls.amount_ether.value)
        this.sendMoney.controls.amount_usd.setValue(ether_val * this.ethusd.value )
      })
      .catch(err=>{
        console.log(err);
      toastr.error('Couldn\'t get exchange rate')
    })
}

  etherAmountChanged(e) {
    let ether_value = parseFloat(e.target.value)
    if(ether_value !== 0 && e.target.value.length > ether_value.toString().length ) {
      e.target.value = ether_value;
    }
    if(ether_value && !isNaN(ether_value)  &&  ether_value >  0){
      let amount_in_usd = ether_value * this.ethusd.value
      this.sendMoney.controls.amount_usd.setValue(amount_in_usd)
    }
  }

  usdAmountChanged(e) {
    let usd_value = parseFloat(e.target.value)
    if(usd_value !== 0 && e.target.value.length > usd_value.toString().length ) {
      e.target.value = usd_value;
    }
    if(usd_value && !isNaN(usd_value) &&  usd_value > 0){
      let amount_in_ether = usd_value / this.ethusd.value
      this.sendMoney.controls.amount_ether.setValue(amount_in_ether)
    }
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

import { Component, OnInit,Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service'
import { TransactionService } from '../services/transaction.service' 

import { Buffer } from 'buffer'
declare var toastr: any;
declare var EthJS : any;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendEther: FormGroup;
  message = ''  
  error = ''
  ethusd : any
  wallet : any
  ready : boolean = false

  constructor(@Inject(FormBuilder) fb: FormBuilder, private route: ActivatedRoute, private transactionService: TransactionService, private walletService: WalletService) {

    this.sendEther = fb.group({
      receiveAddress: ['', Validators.required],
      amount_ether: ['0', Validators.required] ,
      amount_usd: ['0', Validators.required],
      privateKey : [''],
      walletPassword: [''],
      selection: ''
    },
    { validator : this.checkAddressValidity()}
    )

    this.route.queryParams
      .filter(params => params.to || params.value) 
      .subscribe(params => {
        this.sendEther.setValue({ 
          receiveAddress: params.to, 
          amount_ether: params.value,
          amount_usd: 0,
          privateKey: '',
          walletPassword: '',
          selection: ''
        })        
        // console.log(this.transactionService.createTransaction('0x2324434242',params.to,{ value: params.value }))
      });
  }

  onSubmit() {
    if(this.sendEther.controls.selection.value === 'wallet'){
      console.log('do tx by wallet')
      this.walletService
        .getPrivateKeyString(this.wallet,this.sendEther.controls.walletPassword.value)
        .then(privkey => {
            console.log(privkey)
        })
        .catch(err => toastr.error(err))
    }else {
      console.log('do tx by priv key')
    }
  }
  
  checkAddressValidity() {
    // if (EthJS.Util.isValidPublicAddress(publicAddr) && (this.sendEther.controls.privatekey!=='' || EthJS.Util.isValidPrivateAddress )) {
    //   return true
    // }
    let invalidPrivateKey = true, 
        invalidAddress = true

    return (group: FormGroup): {[key: string]: any} => {
      try{
        invalidPrivateKey = !EthJS.Util.isValidPrivate(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(group.controls.privateKey.value)))
      }catch(e){
        invalidPrivateKey = true
      }
      try{
        invalidAddress = !EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(group.controls.receiveAddress.value))
      }
      catch(e){
        invalidAddress = true
      }
    
      return {
        invalidPrivateKey,
        invalidAddress
      }
    }
  }

  ngOnInit() {

    this.transactionService
      .getPrice()
      .then(res => {
        this.ethusd = {
          value: res.ethusd,
          time : new Date(res.ethusd_timestamp * 1000)
        }
        
        let ether_val = parseFloat(this.sendEther.controls.amount_ether.value)
        this.sendEther.controls.amount_usd.setValue(ether_val * this.ethusd.value )
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
      this.sendEther.controls.amount_usd.setValue(amount_in_usd)
    }
    console.log(this.sendEther)
    console.log(this.sendEther.controls['selection'].value === "wallet")
  }

  usdAmountChanged(e) {
    let usd_value = parseFloat(e.target.value)
    if(usd_value !== 0 && e.target.value.length > usd_value.toString().length ) {
      e.target.value = usd_value;
    }
    if(usd_value && !isNaN(usd_value) &&  usd_value > 0){
      let amount_in_ether = usd_value / this.ethusd.value
      this.sendEther.controls.amount_ether.setValue(amount_in_ether)
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
      let wallet = JSON.parse(s)
      if(!wallet.address || !wallet.version || wallet.version!== 3){
        throw true;
      }
      this.wallet = {}
      this.wallet['keystore'] = wallet
      toastr.success('Valid wallet file.')
    }
    catch(e){
      toastr.error("Invalid wallet file.", "Wallet")
    }

  }
  

}

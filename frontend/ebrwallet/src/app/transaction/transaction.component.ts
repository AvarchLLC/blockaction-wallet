import { Component, OnInit,Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var toastr: any;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendMoney: FormGroup;

  message = ''  
  error = ''

  constructor(@Inject(FormBuilder) fb: FormBuilder,) {

    this.sendMoney = fb.group({
      receiveAddress: ['', Validators.required],
      amount: ['', Validators.required] ,
    })
  }

  onSubmit() {
    
  }
  
  ngOnInit() {
  
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
  // *//
  

}

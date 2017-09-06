import {Component, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TransactionService } from '../services/transaction.service';
import { DataService } from '../../services/data.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

import { Wallet } from '../wallet';

import {SpinnerService} from '../../services/spinner.service';
import { Config } from '../../config';
const config = new Config();

declare const toastr: any;
declare var EthJS: any;
// toastr.options = config.toastr;

@Component({
  selector: 'request-ether-component',
  templateUrl: './request-ether.component.html',
  styleUrls:['request-ether.component.css']
})

export class RequestEtherComponent {

  requestEtherForm: FormGroup;

  wallet: Wallet;
  ethusd: any;
  etherAddress: string;
  addressProvided:boolean = false;

  modalVisible = false;

  showSpinner = false;
  ready= false;

  scanQr:boolean =false;
  qrSvg: string;   // QrCode SVG string
  qrClass = '';


  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (this.wallet) {
      event.returnValue = true;
    }
  }
  constructor( fb: FormBuilder,
    private transactionService: TransactionService,
    private dataService: DataService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private spinner: SpinnerService
  ) {

    this.requestEtherForm = fb.group({
      email: ['', Validators.email],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0'],
      message : ['', Validators.required]
    });

    this.transactionService
      .getConversionRate('ethusd')
      .then(res => {
        this.ethusd = {
          value: res.bid,
          time: new Date(res.timestamp * 1000)
        };
      })
      .catch(err => toastr.error('Couldn\'t get exchange rate'));

    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date() ) {
      this.ready = true;
    }
  }

  requestEther() {

    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Request Ether');

    const email = this.requestEtherForm.value.email;
    const amount = this.requestEtherForm.value.amount_ether;
    const str = `Ether request sent to ${email} for ${amount} ether.`;

    this.dataService
      .requestEther(this.etherAddress, email, amount)
      .then(ok => {
        toastr.success(str, 'Request Ether');
        this.requestEtherForm.reset();
      })
      .catch(err => toastr.error('Couldn\'t send request at the moment.'));

  }

  converter(data) {
    
    this.requestEtherForm.controls.amount_ether.setValue(data.baseValue);
    this.requestEtherForm.controls.amount_usd.setValue(data.quoteValue);
  }


  isValidAddress(address: string) {
    try {
        return EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address));
    } catch (e) {
        return false;
    }
  }

  decodedQrOutput(address) {
    if (!this.isValidAddress(address)) {
      this.scanQr = false;
      toastr.error('Not a valid address.');
    } else {
      toastr.success('Successfully scanned address.');
      this.scanQr = false;
      this.etherAddress = address;
    }
  }


  showNextForm(){
      this.addressProvided = true;
  }

}

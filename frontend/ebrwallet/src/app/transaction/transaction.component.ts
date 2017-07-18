import { Component, OnInit, Inject } from '@angular/core';
import 'rxjs/add/operator/filter';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';

import { Buffer } from 'buffer';
import { Config } from '../config';
const config = new Config();

declare var toastr;
// toastr.options = config.toastr;

declare var EthJS: any;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendEther: FormGroup;
  message = '';
  error = '';
  wallet: any;
  ethusd: any;
  ready = false;

  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private walletService: WalletService
  ) {

    this.sendEther = fb.group({
      receiveAddress: ['', Validators.required],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0', Validators.required],
      privateKey: [''],
      walletPassword: [''],
      selection: ''
    },
      { validator: this.checkAddressValidity() }
    );

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
        });
        // console.log(this.transactionService.createTransaction('0x2324434242',params.to,{ value: params.value }))
      });
  }

  onSubmit() {
    if (this.sendEther.controls.selection.value === 'wallet') {
      // do transaction from wallet
      this.walletService
        .getPrivateKeyString(this.wallet, this.sendEther.controls.walletPassword.value)
        .then(privkey => {
          this.sendMoney(privkey);
        })
        .catch(err => toastr.error(err));
    } else {
      // do transaction from private key
      this.sendMoney();
    }
  }

  sendMoney(privkey: string = null) {
    if (privkey === null) {
      privkey = this.sendEther.controls.privateKey.value;
    }

    this.transactionService
      .sendMoney(
        this.sendEther.controls.receiveAddress.value,
        this.sendEther.controls.amount_ether.value,
        privkey
      )
      .then(ok => console.log('successs', ok))
      .catch(err => console.error(err));
  }
  checkAddressValidity() {
    // if (EthJS.Util.isValidPublicAddress(publicAddr) && (this.sendEther.controls.privatekey!=='' || EthJS.Util.isValidPrivateAddress )) {
    //   return true
    // }
    let invalidPrivateKey = true,
      invalidAddress = true;

    return (group: FormGroup): { [key: string]: any } => {
      try {
        invalidPrivateKey = !EthJS.Util.isValidPrivate(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(group.controls.privateKey.value)));
      } catch (e) {
        invalidPrivateKey = true;
      }
      try {
        invalidAddress = !EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(group.controls.receiveAddress.value));
      } catch (e) {
        invalidAddress = true;
      }

      return {
        invalidPrivateKey,
        invalidAddress
      };
    };
  }

  ngOnInit() {

    this.transactionService
      .getPrice()
      .then(res => {
        this.ethusd = {
          value: res.ethusd,
          time: new Date(res.ethusd_timestamp * 1000)
        };

        const ether_val = parseFloat(this.sendEther.controls.amount_ether.value);
        this.sendEther.controls.amount_usd.setValue(ether_val * this.ethusd.value);
      })
      .catch(err => {
        // console.log(err);
        toastr.error('Couldn\'t get exchange rate');
      });
  }

  etherAmountChanged(e) {
    const ether_value = parseFloat(e.target.value);
    if (ether_value !== 0 && e.target.value.length > ether_value.toString().length) {
      e.target.value = ether_value;
    }
    if (ether_value && !isNaN(ether_value) && ether_value > 0) {
      const amount_in_usd = ether_value * this.ethusd.value;
      this.sendEther.controls.amount_usd.setValue(amount_in_usd);
    }
  }

  usdAmountChanged(e) {
    const usd_value = parseFloat(e.target.value);
    if (usd_value !== 0 && e.target.value.length > usd_value.toString().length) {
      e.target.value = usd_value;
    }
    if (usd_value && !isNaN(usd_value) && usd_value > 0) {
      const amount_in_ether = usd_value / this.ethusd.value;
      this.sendEther.controls.amount_ether.setValue(amount_in_ether);
    }
  }

  /*  Loading wallet by file upload
   *
   *
   * */
  fileChangeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const self = this;
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = function (e) {
      self.loadWalletFromString(myReader.result);
    };

    myReader.readAsText(file);
  }
  loadWalletFromString(s: string): void {
    try {
      // throw "err"
      const wallet = JSON.parse(s);
      if (!wallet.address || !wallet.version || wallet.version !== 3) {
        throw true;
      }
      this.wallet = {};
      this.wallet['keystore'] = wallet;
      toastr.success('Valid wallet file.');
    } catch (e) {
      toastr.error('Invalid wallet file.', 'Wallet');
    }

  }


}

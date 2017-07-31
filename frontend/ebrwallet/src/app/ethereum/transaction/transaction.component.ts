import { Wallet } from '../wallet';
import { Component, OnInit, Inject, Input } from '@angular/core';
import 'rxjs/add/operator/filter';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import {SpinnerService} from '../../services/spinner.service';


declare var toastr;

declare var EthJS: any;

@Component({
  selector: 'app-ethereum-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @Input() mode: string;

  sendEther: FormGroup;
  requestEther: FormGroup;

  keyInput: string;
  wallet: Wallet;
  walletPassword: string;
  ethusd: any;

  message = '';
  error = '';
  ready = false;
  existing = 'wallet';

  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private spinner: SpinnerService
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

    this.requestEther = fb.group({
      email: ['', Validators.required],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0', Validators.required],
      message: ['', Validators.required]
    });

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

  isValidPrivateKey(privKey: string) {
    let valid;
    try {
        valid = EthJS.Util.isValidPrivate(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(privKey)));
    } catch (e) {
        valid = false;
    }
    // console.log('Valid', valid)
    return valid;
  }

  checkAddressValidity() {
    return (group: FormGroup): { [key: string]: any } => {
      let invalidAddress = true;

      try {
        invalidAddress = !EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(group.controls.receiveAddress.value));
      } catch (e) {
        invalidAddress = true;
      }

      return { invalidAddress };
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

  etherAmountChanged(e, form) {
    const ether_value = parseFloat(e.target.value);
    if (ether_value !== 0 && e.target.value.length > ether_value.toString().length) {
      e.target.value = ether_value;
    }
    if (ether_value && !isNaN(ether_value) && ether_value > 0) {
      const amount_in_usd = ether_value * this.ethusd.value;
      form.controls.amount_usd.setValue(amount_in_usd);
    }
  }

  usdAmountChanged(e, form) {
    const usd_value = parseFloat(e.target.value);
    if (usd_value !== 0 && e.target.value.length > usd_value.toString().length) {
      e.target.value = usd_value;
    }
    if (usd_value && !isNaN(usd_value) && usd_value > 0) {
      const amount_in_ether = usd_value / this.ethusd.value;
      form.controls.amount_ether.setValue(amount_in_ether);
    }
  }

  showCardFromKey() {

    const privKey = EthJS.Util.addHexPrefix(this.keyInput.trim());
    if (EthJS.Util.isValidPrivate(EthJS.Util.toBuffer(privKey))) {

      this.wallet = new Wallet;
      this.wallet.privateKey = privKey;
      this.wallet.address = EthJS.Util.bufferToHex(EthJS.Util.privateToAddress(privKey));
      this.ready = true;
    } else {
      toastr.error('Not a valid key. Please enter another one.');
    }
  }

  // Load wallet from uploaded file
  fileChangeListener($event): void {
    // this.readThis($event.target);
    this.walletService
      .readWalletFromFile($event.target)
      .then(wallet => {
        this.wallet = wallet;
        toastr.success('Valid wallet file.');
      })
      .catch(err => toastr.error('Invalid wallet file.'));
  }

  decryptWallet() {
    this.spinner.displaySpiner(true);

    setTimeout(async function () {
    // TODO: Get private key from wallet
      try {
        this.wallet.privateKey = await this.walletService.getPrivateKeyString(this.wallet, this.walletPassword);
        this.ready = true;
        this.spinner.displaySpiner(false);
      }catch(e) {
        this.spinner.displaySpiner(false);
        toastr.error('Wrong wallet password.')
      }
    }.bind(this), 1000);
  }


}

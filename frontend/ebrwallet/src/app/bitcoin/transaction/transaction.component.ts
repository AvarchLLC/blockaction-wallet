import { Component, OnInit, Inject, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/filter';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import {SpinnerService} from '../../services/spinner.service';

import { Wallet } from '../wallet';

declare var toastr;
declare var bitcore: any;

@Component({
  selector: 'app-ethereum-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendBitcoin: FormGroup;

  keyInput: string;
  wallet: Wallet;
  btcusd: any;

  message = '';
  error = '';
  ready = false;

  receipt: any;
  test: any;

  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private spinner: SpinnerService,
    private dataService: DataService
  ) {

    this.sendBitcoin = fb.group({
      receiveAddress: ['', Validators.required],
      amount_bitcoin: ['0', Validators.required],
      amount_usd: ['0', Validators.required],

    });

    this.route.queryParams
      .filter(params => params.to || params.value)
      .subscribe(params => {
        this.sendBitcoin.setValue({
          receiveAddress: params.to,
          amount_bitcoin: params.value,
          amount_usd: 0
        });
      });
  }

  onSubmit() {
    this.sendMoney();
  }

  sendMoney() {
    this.spinner.displaySpiner(true);
    const receiver = this.sendBitcoin.controls.receiveAddress.value;
    const amount = parseFloat(this.sendBitcoin.controls.amount_bitcoin.value);

    this.transactionService.createTransaction(this.wallet.address,receiver,amount.toString(),this.wallet.privateKey)
      .then(res => {
        this.router.navigate(['/bitcoin/info'], {queryParams: { pending: res.txid, address: this.wallet.address}});
        this.spinner.displaySpiner(false);
        toastr.success(res);
      })
      .catch(err => {
        this.spinner.displaySpiner(false);
        toastr.error(err)
      });
  }

  isValidPrivateKey(privKey: string) {
    return bitcore.PrivateKey.isValid(privKey);
  }

  isValidAddress(address: string) {
    if (environment.production) {
      return bitcore.Address.isValid(address);
    } else {
      return bitcore.Address.isValid(address, bitcore.Networks.testnet);
    }
  }

  ngOnInit() {
    this.dataService
      .getCoinData('bitcoin')
      .then(coinData => {
        this.btcusd = coinData[0].price_usd;
      });
  }

  converter(data) {
    this.sendBitcoin.controls.amount_bitcoin.setValue(data.baseValue);
    this.sendBitcoin.controls.amount_usd.setValue(data.quoteValue);
  }

  showCardFromKey() {
    this.wallet = new Wallet;
    try {
      if (environment.production) {

        const privateKey = new bitcore.PrivateKey(this.keyInput);
        this.wallet.privateKey = privateKey.toWIF();
        this.wallet.address = privateKey.toAddress();
      } else {

        const privateKey = new bitcore.PrivateKey(this.keyInput);
        this.wallet.privateKey = privateKey.toWIF(); // get private key in wallet imoprt format
        this.wallet.address = privateKey.toAddress(bitcore.Networks.testnet);
      }
      this.spinner.displaySpiner(false);
      this.ready = true;
    } catch (e) {
      this.spinner.displaySpiner(false);
      toastr.error('Not a valid key. Please enter another one.');
    }
  }

  /**
   * Calculate transaction fee and total cost of transaction
   */
  makeReceipt() {
    this.spinner.displaySpiner(true);
    const from = this.wallet.address;
    const to = this.sendBitcoin.controls.receiveAddress.value;
    const amount = this.sendBitcoin.controls.amount_bitcoin.value;
    const amount_usd = this.sendBitcoin.controls.amount_usd.value;

    let fee = 0.000128;
    let total = amount + fee;
    let balance;
    this.receipt = {
      to,
      from,
      balance,
      amount,
      amount_usd,
      fee,
      total
    };
    this.spinner.displaySpiner(false);
  }

  cancelReceipt() {
    this.receipt = null;
  }

}

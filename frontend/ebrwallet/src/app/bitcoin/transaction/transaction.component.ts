import { environment } from '../../../environments/environment';
import { Wallet } from '../wallet';
import { Component, OnInit, Inject, Input } from '@angular/core';
import 'rxjs/add/operator/filter';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletService } from '../services/wallet.service';
import { TransactionService } from '../services/transaction.service';
import {SpinnerService} from '../../services/spinner.service';


declare var toastr;
declare var Web3: any;
declare var EthJS: any;

@Component({
  selector: 'app-ethereum-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  sendBitcoin: FormGroup;

  keyInput: string;
  wallet: Wallet;
  ethusd: any;

  message = '';
  error = '';
  ready = false;

  receipt: any;

  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private spinner: SpinnerService
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
          receiveAddress: EthJS.Util.addHexPrefix(params.to),
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
    this.transactionService
      .sendMoney(
        this.wallet.address,
        this.sendBitcoin.controls.receiveAddress.value,
        this.sendBitcoin.controls.amount_bitcoin.value,
        '100',
        this.wallet.privateKey
      )
      .then(hash => {
        this.router.navigate(['/bitcoin/info'], {queryParams: { pending: hash, address: this.wallet.address}});
        toastr.success('Transaction sent');
        this.spinner.displaySpiner(false);
      })
      .catch(err => {
        this.spinner.displaySpiner(false);
        if (err.message.indexOf('funds') > -1) {
          toastr.error('Insufficent Funds');
        } else {
          toastr.error('Couldn\'t send transaction.');
        }
      });
  }

  isValidPrivateKey(privKey: string) {
    return true;
  }

  isValidAddress(address: string) {
    return false;
  }

  ngOnInit() {
    // this.transactionService
    //   .getConversionRate('ethusd')
    //   .then(res => {
    //     this.ethusd = {
    //       value: res.bid,
    //       time: new Date(res.timestamp * 1000)
    //     };
    //   })
    //   .catch(err => {
    //     toastr.error('Couldn\'t get exchange rate');
    //   });
  }

  converter(data) {
    this.sendBitcoin.controls.amount_bitcoin.setValue(data.baseValue);
    this.sendBitcoin.controls.amount_usd.setValue(data.quoteValue);
  }

  showCardFromKey() {
    if (this.keyInput) {
      this.wallet = new Wallet;
      this.wallet.privateKey = this.keyInput; //privKey;
      this.wallet.address = 'true'; //EthJS.Util.addHexPrefix(EthJS.Util.bufferToHex(EthJS.Util.privateToAddress(privKey)));
      this.ready = true;
    } else {
      toastr.error('Not a valid key. Please enter another one.');
    }
  }

  /**
   * Calculate transaction fee and total cost of transaction
   */
  makeReceipt() {
    // this.spinner.displaySpiner(true);
    // const from = this.wallet.address;
    // const to = EthJS.Util.addHexPrefix(this.sendBitcoin.controls.receiveAddress.value);
    // const amount = this.sendBitcoin.controls.amount_bitcoin.value;
    // const amount_usd = this.sendBitcoin.controls.amount_usd.value;
    // const value = this.transactionService.intToHex(this.transactionService.etherToWei(amount));

    // let fee;

    // this.transactionService.getTransactionCost({ to, value })
    //   .then(res => {
    //     fee = res['cost'];
    //     this.gasPrice = res['price'];
    //     return this.transactionService.getBalance(from);
    //   })
    //   .then(balance => {
    //     let total = new this.web3.BigNumber(fee);
    //     total = total.add(amount).toString();

    //     this.receipt = {
    //       to,
    //       from,
    //       balance,
    //       amount,
    //       amount_usd,
    //       fee,
    //       total
    //     };
    //     this.spinner.displaySpiner(false);
    //   })
    //   .catch(err => {
    //     this.spinner.displaySpiner(false);
    //     toastr.error(err)//'Error building transaction. Please try again.')
    //   })
  }

  cancelReceipt() {
    this.receipt = null;
  }

}

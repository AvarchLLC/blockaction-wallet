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

  keyInput: string;
  wallet: Wallet;
  walletPassword: string;
  ethusd: any;

  message = '';
  error = '';
  ready = false;
  existing = 'wallet';

  receipt: any;

  constructor( @Inject(FormBuilder) fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private spinner: SpinnerService
  ) {

    this.sendEther = fb.group({
      receiveAddress: ['', Validators.required],
      amount_ether: ['0', Validators.required],
      amount_usd: ['0', Validators.required],

    });

    this.route.queryParams
      .filter(params => params.to || params.value)
      .subscribe(params => {
        this.sendEther.setValue({
          receiveAddress: params.to,
          amount_ether: params.value,
          amount_usd: 0
        });
      });
  }

  onSubmit() {
    this.sendMoney();
  }

  sendMoney() {
    this.transactionService
      .sendMoney(
        this.wallet.address,
        this.sendEther.controls.receiveAddress.value,
        this.sendEther.controls.amount_ether.value,
        this.wallet.privateKey
      )
      .then(hash => {
        this.router.navigate(['/ethereum/info'], {queryParams: { pending: hash, address: this.wallet.address}});
        toastr.success('Transaction sent');
      })
      .catch(err => {
        if (err.message.indexOf('funds') > -1) {
          toastr.error('Insufficent Funds');
        } else {
          toastr.error('Couldn\'t send transaction.');
        }
      });
  }

  isValidPrivateKey(privKey: string) {
    try {
        return EthJS.Util.isValidPrivate(EthJS.Util.toBuffer(EthJS.Util.addHexPrefix(privKey)));
    } catch (e) {
        return false;
    }
  }

  isValidAddress(address: string) {
    try {
      return EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address));
    } catch (e) {
      return false;
    }
  }

  ngOnInit() {
    this.transactionService
      .getConversionRate('ethusd')
      .then(res => {
        this.ethusd = {
          value: res.bid,
          time: new Date(res.timestamp * 1000)
        };

        // const ether_val = parseFloat(this.sendEther.controls.amount_ether.value);
        // this.sendEther.controls.amount_usd.setValue(ether_val * this.ethusd.value);
      })
      .catch(err => {
        toastr.error('Couldn\'t get exchange rate');
      });
  }

  converter(data) {
    this.sendEther.controls.amount_ether.setValue(data.baseValue);
    this.sendEther.controls.amount_usd.setValue(data.quoteValue);
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

  /**
   * Calculate transaction fee and total cost of transaction
   */
  makeReceipt() {
    const from = this.wallet.address;
    const to = this.sendEther.controls.receiveAddress.value;
    const amount = this.sendEther.controls.amount_ether.value;
    const value = this.transactionService.intToHex(this.transactionService.etherToWei(amount));

    let fee;

    this.transactionService.getTransactionCost({ to, value})
      .then(cost => {
        fee = cost;
        return this.transactionService.getBalance(from);
      })
      .then(balance => {
        this.receipt = {
          to,
          from,
          balance,
          amount,
          fee,
          total : amount + fee
        };
      })
      .catch(err => toastr.error('Error building transaction. Please try again.'));
  }
}

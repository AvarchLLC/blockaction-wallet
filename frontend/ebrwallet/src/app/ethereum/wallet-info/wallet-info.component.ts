import {Component, Input, OnInit} from '@angular/core';

import { Wallet} from '../wallet';
import {TransactionService} from '../services/transaction.service';
import {WalletService} from '../services/wallet.service';

declare var EthJS: any;
declare var toastr: any;

class Transaction {

}
@Component({
  selector: 'app-ethereum-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.css']
})
export class WalletInfoComponent implements OnInit {

  wallet: Wallet;

  keyInput: string;
  balance: string;
  transactions: Transaction[];

  ready= false;
  existing = 'wallet';

  constructor(private transactionService: TransactionService, private walletService: WalletService) {

  }

  ngOnInit() {
    // this.walletService
    //   .getBalance(this.wallet.address)
    //   .then(balance => this.balance = balance)
    //   .catch(err => toastr.error('Failed to retrieve wallet balance'));

    // this.transactionService
    //   .getAllTransactions(this.wallet.address)
    //   .then(txns => this.transactions = txns)
    //   .catch(err => toastr.error('Failed to retrieve wallet transactions'));
  }

  isValidAddress(address: string) {
    let valid;
    try {
        valid = EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address));
    } catch (e) {
        valid = false;
    }
    return valid;
  }

  fileChangeListener($event) {
    this.walletService
      .readWalletFromFile($event.target)
      .then(wallet => {
        this.wallet = wallet;
        this.ready = true;
        toastr.success('Valid wallet file.');
      })
      .catch(err => toastr.error('Invalid wallet file.'));
  }

  showCardFromKey() {
    this.wallet = new Wallet;
    this.wallet.address = this.keyInput;
    this.ready = true;
  }
}

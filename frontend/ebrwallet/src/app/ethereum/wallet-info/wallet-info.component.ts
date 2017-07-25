import {Component, Input, OnInit} from '@angular/core';

import { Wallet} from '../../wallet';
import {TransactionService} from '../../services/transaction.service';
import {WalletService} from '../../services/wallet.service';

declare var toastr: any;

class Transaction {

}
@Component({
  selector: 'app-ethereum-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.css']
})
export class WalletInfoComponent implements OnInit {

  @Input() wallet = new Wallet;

  balance: string;
  transactions: Transaction[];

  modalType = '';
  modalVisible: boolean;

  constructor(private transactionService: TransactionService, private walletService: WalletService) {

  }

  ngOnInit() {
    this.walletService
      .getBalance(this.wallet.address)
      .then(balance => this.balance = balance)
      .catch(err => toastr.error('Failed to retrieve wallet balance'));

    this.transactionService
      .getAllTransactions(this.wallet.address)
      .then(txns => this.transactions = txns)
      .catch(err => toastr.error('Failed to retrieve wallet transactions'));
  }

  showModal(view) {
    console.log(view);
    this.modalType = view;
    this.modalVisible = true;
  }

  hideModal() {
    this.modalVisible = false;
  }

}

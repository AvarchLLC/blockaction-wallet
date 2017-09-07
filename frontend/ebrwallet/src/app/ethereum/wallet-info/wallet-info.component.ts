import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { ActivatedRoute, Route } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { Wallet} from '../wallet';
import {EthereumTransactionService} from '../services/ethereum-transaction.service';
import {EthereumWalletService} from '../services/ethereum-wallet.service';


import { PaginationInstance } from 'ngx-pagination';
declare var EthJS: any;
declare var toastr: any;
declare var Web3: any;


@Component({
  selector: 'app-ethereum-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.css']
})
export class WalletInfoComponent implements OnInit {
  web3: any;

  ready= false;
  existing = 'key';
  keyInput: string;

  wallet: Wallet;
  balance: string;
  balance_usd: string;
  transactions: any = null; // Transaction[];

  scanQr: boolean;

  qrSvg: string;
  qrClass = '';
  blockie: string;

  page = 1 ;
  total: number;  // total pages of transaction
  loading: boolean;
  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: this.page,
    totalItems: this.total
  };

  pending: any; // Pending transaction
  txhash: string;
  private alive: boolean; // used to unsubscribe from the IntervalObservable
                          // when OnDestroy is called.
  private timer: Observable<number>;
  private interval: number;

  selectedTx: any;
  modalVisible: boolean;

  constructor(
    private transactionService: EthereumTransactionService,
    private walletService: EthereumWalletService,
    private route: ActivatedRoute,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.web3 = new Web3();

    this.alive = true;
    this.interval = 10000;
    this.timer = Observable.timer(0, this.interval);

    this.route.queryParams
      .filter(params => params.pending || params.address)
      .subscribe(params => {
        // if(!(params.address || params.pending)) {
        //   this.wallet = null;
        //   return;
        // }
        window.scrollTo(0, 0);
        this.txhash = params.pending;
        this.keyInput = params.address;
        this.showCardFromKey();
        if (this.txhash) {
          this.checkPendingTransaction(this.txhash);
        }
      });
  }

  ngOnInit() { }

  getDate(timeStamp) {
    return new Date(timeStamp * 1000);
  }

  toEther(wei) {
    return this.transactionService.weiToEther(wei);
  }

  isValidAddress(address: string) {
    try {
        return EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address));
    } catch (e) {
        return false;
    }
  }

  fileChangeListener($event) {
    this.walletService
      .readWalletFromFile($event.target)
      .then(wallet => {
        this.wallet = wallet;
        this.showInfo();
        toastr.success('Valid wallet file.');
      })
      .catch(err => toastr.error('Invalid wallet file.'));
  }

  showCardFromKey() {
    this.wallet = new Wallet;
    this.wallet.address = EthJS.Util.addHexPrefix(this.keyInput);
    this.showInfo();
  }

  showInfo(){
    this.ready = true;
    this.showQr();
    this.blockie = this.walletService.getBlockie(this.wallet);

    this.transactionService
      .getBalance(this.wallet.address)
      .then(balance => {
        this.balance = balance;
        return this.transactionService.getConversionRate('ethusd');
      })
      .then(rate => {
        const bal = rate.bid * parseFloat(this.balance);
        this.balance_usd = bal.toString();
      })
      .catch(err => toastr.error('Failed to retrieve wallet balance'));

    this.transactionService
      .getAllTransactions(this.wallet.address)
      .then(txns => {
        this.transactions = txns;
        this.total = txns.length;
        this.loading = false;
      })
      .catch(err => toastr.error('Failed to retrieve wallet transactions'));
  }

  showQr(): void {
    if (this.wallet) {
      this.walletService
        .getQrCode(this.wallet)
        .then(qrCode => this.qrSvg = qrCode);
    }
  }

  qrToggle() {
    this.googleAnalyticsService
      .emitEvent('Post Wallet Creation', 'Show Qr');

    this.qrClass === ''
      ? this.qrClass = 'showQr'
      : this.qrClass = '';
  }

  checkPendingTransaction(txhash: string) {
    // check transaction immediately when the info component loads
    this.timer
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.transactionService.getTransactionDetails(txhash)
          .then(data => {
            if (!data) {
              this.pending = {
                hash : this.txhash
              };
            } else {
              this.pending = data;

              if (data['blockNumber']) {
                this.alive = false;
                this.pending = null;
                this.transactionService
                  .getAllTransactions(this.wallet.address)
                  .then(txns => {
                    this.transactions = txns;
                    this.total = txns.length;
                    this.loading = false;
                  })
                  .catch(err => toastr.error('Failed to refresh wallet transactions'));

                  this.transactionService
                  .getBalance(this.wallet.address)
                  .then(balance => this.balance = balance)
                  .catch(err => toastr.error('Failed to refresh wallet balance'));
              }
            }

            });
      });
  }

  getTransactionFee(gasUsed, gasPrice) {
    const price = new this.web3.BigNumber(gasPrice);
    const fee = price.div(1e18).mul(gasUsed).toString();
    return fee;
  }

  showTxDetail(tx: any) {
    this.selectedTx = tx;
    this.modalVisible = true;
  }

  decodedQrOutput(address) {
    if (!this.isValidAddress(address)) {
      this.scanQr = false;
      toastr.error('Not a valid address.');
    } else {
      toastr.success('Successfully scanned address.');
      this.scanQr = false;
      this.keyInput = address;
    }
  }

  OnDestroy() {
    this.alive = false;
  }
}

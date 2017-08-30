import { DataService } from '../../services/data.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { ActivatedRoute, Route } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { Wallet} from '../wallet';
import {TransactionService} from '../services/transaction.service';
import {WalletService} from '../services/wallet.service';


import { PaginationInstance } from 'ngx-pagination';
declare var toastr: any;
declare var bitcore: any;


@Component({
  selector: 'app-bitcoin-wallet-info',
  templateUrl: './wallet-info.component.html',
  styleUrls: ['./wallet-info.component.css']
})
export class WalletInfoComponent implements OnInit {

  ready= false;
  keyInput: string;

  wallet: Wallet;
  balance: string;
  balance_usd: string;
  transactions: any = null; // Transaction[];

  btcusd;

  scanQr: boolean;
  qrSvg: string;
  qrClass = '';
  blockie: string;

  page = 1 ;
  total: number;  // total pages of transaction
  loading: boolean;


  pending: any; // Pending transaction
  txhash: string;
  private alive: boolean; // used to unsubscribe from the IntervalObservable
                          // when OnDestroy is called.
  private timer: Observable<number>;
  private interval: number;

  constructor(
    private transactionService: TransactionService,
    private dataService: DataService,
    private walletService: WalletService,
    private route: ActivatedRoute,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {

    this.alive = true;
    this.interval = 10000;
    this.timer = Observable.timer(0, this.interval);

    this.route.queryParams
      .filter(params => params.pending || params.address)
      .subscribe(params => {
        window.scrollTo(0, 0);

        this.txhash = params.pending;
        this.keyInput = params.address;
        this.showCardFromKey();
        // if (this.txhash) {
        //   this.checkPendingTransaction(this.txhash);
        // }
      });
  }

  ngOnInit() {
    this.dataService.getCoinData('bitcoin')
      .then(res => this.btcusd = res[0].price_usd);
  }

  getDate(timeStamp) {
    return new Date(timeStamp * 1000);
  }

  isValidAddress(address: string) {
    return bitcore.Address.isValid(address);
  }

  showCardFromKey() {
    this.wallet = new Wallet;
    this.wallet.address = this.keyInput;
    this.showInfo();
  }

  async showInfo() {
    this.ready = true;
    this.showQr();
    this.blockie = this.walletService.getBlockie(this.wallet);

    this.loading = true;
    this.transactionService
      .getTransactions(this.wallet.address, 1)
      .then(res => {
        this.total = res.totalItems;
        this.transactions  = res.items;
        this.loading = false;
      })
      .catch(err => {
        toastr.error('Failed to retrieve wallet transactions');
        this.loading = false;
      });

    // Check that the convertion rate is retrived
    if (!this.btcusd) {
      const btcusd = await this.dataService.getCoinData('bitcoin');
      this.btcusd = btcusd[0].price_usd;
    }

    this.transactionService.getBalance(this.wallet.address)
      .then(bal => {
        this.balance = bitcore.Unit.fromSatoshis(bal).toBTC();
        const balance_usd = parseFloat(this.balance) * parseFloat(this.btcusd);
        this.balance_usd = balance_usd.toString();
      }).catch(err => {
        toastr.error('Failed to retrieve wallet balance');
        this.loading = false;
      });
  }

  getPage(page: number) {
    this.loading = true;
    this.transactionService
      .getTransactions(this.wallet.address, page)
      .then(res => {
        this.transactions  = res.items;
        this.page = page;
        this.loading = false;
      })
      .catch(err => {
        toastr.error('Failed to retrieve wallet information')
        this.loading = false;
      });
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

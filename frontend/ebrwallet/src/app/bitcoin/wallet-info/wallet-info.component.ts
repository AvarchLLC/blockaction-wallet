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
  transactions: any = null; // Transaction[];


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
    private walletService: WalletService,
    private route: ActivatedRoute,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {

    this.alive = true;
    this.interval = 10000;
    this.timer = Observable.timer(0, this.interval);

    this.route.queryParams
      .filter(params => params.pending && params.address)
      .subscribe(params => {
        this.txhash = params.pending;
        this.keyInput = params.address;
        this.showCardFromKey();
        // if (this.txhash) {
        //   this.checkPendingTransaction(this.txhash);
        // }
      });
  }

  ngOnInit() { }

  getDate(timeStamp) {
    return new Date(timeStamp * 1000);
  }

  toBitcoin(satoshi) {
    return (satoshi / 1e8).toString();
  }

  isValidAddress(address: string) {
    // try {
    //     return EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address));
    // } catch (e) {
    //     return false;
    // }
    return true;
  }

  showCardFromKey() {
    this.wallet = new Wallet;
    this.wallet.address = this.keyInput;
    this.showInfo();
  }

  showInfo(){
    this.ready = true;
    this.showQr();
    this.blockie = this.walletService.getBlockie(this.wallet);

    this.transactionService
      .getAddressInfo(this.wallet.address, 1)
      .then(res => {
        this.balance = this.toBitcoin(res.final_balance);
        this.total = res.n_tx;
        console.log(this.total)
        this.transactions  = res.txs;
      })
      .catch(err => toastr.error('Failed to retrieve wallet information'));
  }
  
  getPage(page: number) {
    console.log(page)
    this.transactionService
      .getAddressInfo(this.wallet.address, page)
      .then(res => {
        this.transactions  = res.txs;
        this.page = page;
      })
      .catch(err => toastr.error('Failed to retrieve wallet information'));
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
    
  ngOnDestroy() {
    this.alive = false;
  }
}

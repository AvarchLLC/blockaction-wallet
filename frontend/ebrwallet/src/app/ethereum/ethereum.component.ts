import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleAnalyticsService} from '../services/google-analytics.service';

import { Wallet } from '../wallet';
import {WalletComponent} from "./wallet/wallet.component";

declare var toastr: any;
declare var EthJS: any;

@Component({
  selector: 'app-ethereum',
  templateUrl: './ethereum.component.html',
  styleUrls: ['./ethereum.component.css']
})
export class EthereumComponent implements OnInit {

  @ViewChild(WalletComponent) private walletComponent: WalletComponent;

  ready = false;
  starterBox = true;

  showCreate = false;
  showExisting = false;
  showDetail = false;

  addressInput = '';

  wallet: Wallet;
  existing = 'wallet';
  reset = false;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    if (localStorage.getItem('messageShown') && new Date(localStorage.getItem('messageShown')) > new Date() ) {
      this.ready = true;
    }
  }


  isReady() {
    this.googleAnalyticsService
      .emitEvent('Wallet Page', 'Button Clicked', 'Ok, Got It');
    this.ready = true;
    const messageExpiry = new Date();
    messageExpiry.setHours(messageExpiry.getHours() + 1);
    localStorage.setItem('messageShown', messageExpiry.toString());
  }

  showCard(ok) {
    this.showCreate = false;
    this.showExisting = false;
    this.showDetail = true;
  }

  setWallet(wallet) {
    this.wallet = wallet;
  }

  showCardFromAddress() {
    const address = this.addressInput.trim();
    if (EthJS.Util.isValidAddress(EthJS.Util.addHexPrefix(address))) {

      this.wallet = new Wallet;
      this.wallet.address = EthJS.Util.stripHexPrefix(address);
      this.showCard(this.wallet);
    } else {
      toastr.error('Not a valid address. Please enter another one.');
    }
  }

  readWalletFile($event): void {

    const self = this;
    const file: File = $event.target.files[0];
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
      this.wallet = new Wallet;
      this.wallet['keystore'] = wallet;
      this.wallet['address'] = wallet.address;
      this.showCard(this.wallet);
      toastr.success('Valid wallet file.');
    } catch (e) {
      toastr.error('Invalid wallet file.', 'Wallet');
    }

  }

  goBack() {
    if (this.showCreate && this.wallet) {
      const confirmMsg = 'You haven\'t downloaded wallet yet. If you go back, you will lose your wallet.';
      if (confirm(confirmMsg)) {
          this.wallet = null;
          this.walletComponent.wallet = null;
      }
      return;
    }

    if (this.wallet) {
      this.wallet = null;
      this.starterBox = true;
      this.showDetail = false;
    }

    if (this.showCreate || this.showExisting) {
      this.showCreate = false;
      this.showExisting = false;
      this.existing = 'wallet';
      this.starterBox = true;
      return;
    }
  }


}

import { NgModule } from '@angular/core';

import { DonationRoutingModule } from './donation-routing.module';
import { SharedModule } from '../shared/shared.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { QrScannerModule } from 'angular2-qrscanner';

import { DonateBitcoinComponent } from './donate-bitcoin.component';
import { DonateEthereumComponent } from './donate-ethereum.component';

import { EthereumWalletService }  from './../ethereum/services/ethereum-wallet.service';
import { EthereumTransactionService } from './../ethereum/services/ethereum-transaction.service';
import { BitcoinWalletService } from './../bitcoin/services/bitcoin-wallet.service';
import { BitcoinTransactionService } from './../bitcoin/services/bitcoin-transaction.service';


@NgModule({
  imports: [
    DonationRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QrScannerModule
  ],
  declarations: [
   DonateBitcoinComponent,
   DonateEthereumComponent
  ],
  providers: [
      EthereumWalletService, 
      EthereumTransactionService, 
      BitcoinWalletService,
      BitcoinTransactionService
  ]
})
export class DonationModule { }

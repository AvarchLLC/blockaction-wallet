import { NgModule } from '@angular/core';

import { BitcoinRoutingModule } from './bitcoin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { QrScannerModule } from 'angular2-qrscanner';

import { WalletComponent } from './wallet/wallet.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { TransactionComponent } from './transaction/transaction.component';
import { RequestBitcoinComponent } from './request/request-bitcoin.component';

import { BitcoinWalletService } from './services/bitcoin-wallet.service';
import { BitcoinTransactionService } from './services/bitcoin-transaction.service';

@NgModule({
  imports: [
    BitcoinRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QrScannerModule
  ],
  declarations: [
    WalletComponent,
    WalletInfoComponent,
    TransactionComponent,
    RequestBitcoinComponent
  ],
  providers: [BitcoinWalletService, BitcoinTransactionService]
})
export class BitcoinModule { }

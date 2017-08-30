import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { BitcoinRoutingModule } from './bitcoin-routing.module';
import {SharedModule} from '../shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import { QrScannerModule } from 'angular2-qrscanner';

import {WalletComponent} from './wallet/wallet.component';
import { WalletInfoComponent } from './wallet-info/wallet-info.component';
import { TransactionComponent } from './transaction/transaction.component';


import {WalletService} from './services/wallet.service';
import { TransactionService } from './services/transaction.service';

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
    TransactionComponent
  ],
  providers: [WalletService, TransactionService],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BitcoinModule { }

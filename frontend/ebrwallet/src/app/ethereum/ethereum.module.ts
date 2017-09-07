import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { EthereumRoutingModule } from './ethereum-routing.module';
import {SharedModule} from '../shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import { QrScannerModule } from 'angular2-qrscanner';

import {WalletComponent} from './wallet/wallet.component';
import {TransactionComponent} from './transaction/transaction.component';
import {WalletInfoComponent} from './wallet-info/wallet-info.component';
import { RequestEtherComponent } from './request/request-ether.component';

import {WalletService} from './services/wallet.service';
import {TransactionService} from './services/transaction.service';

@NgModule({
  imports: [
    EthereumRoutingModule,
    SharedModule,
    NgxPaginationModule,
    QrScannerModule
  ],
  declarations: [
    WalletComponent,
    TransactionComponent,
    WalletInfoComponent,
    RequestEtherComponent
  ],
  providers: [WalletService, TransactionService],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EthereumModule { }
